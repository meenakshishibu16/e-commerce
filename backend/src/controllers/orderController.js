import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import { getStripe } from "../utils/stripe.js";

function assertAddress(addr){
  const reqd=["fullName","phone","line1","city","state","pincode"];
  for(const k of reqd){
    if(!addr?.[k] || String(addr[k]).trim().length===0) return `Missing address field: ${k}`;
  }
  return null;
}
function cartToOrderItems(cart){
  return (cart.items||[]).map(it=>({
    product:it.product,size:it.size,qty:it.qty,price:it.priceAtAdd,title:it.titleSnapshot,imageUrl:it.imageUrlSnapshot
  }));
}
async function getUserCart(userId){
  return Cart.findOne({user:userId});
}

export async function createCODOrder(req,res,next){
  try{
    const address=req.body?.shippingAddress;
    const err=assertAddress(address);
    if(err) return res.status(400).json({message:err});
    const cart=await getUserCart(req.user._id);
    if(!cart || cart.items.length===0) return res.status(400).json({message:"Cart is empty"});
    const subtotal=cart.items.reduce((s,it)=>s+it.priceAtAdd*it.qty,0);
    const order=await Order.create({
      user:req.user._id, items:cartToOrderItems(cart), subtotal,
      shippingAddress:address, paymentMethod:"COD", paymentStatus:"PENDING", orderStatus:"PLACED"
    });
    cart.items=[]; await cart.save();
    res.status(201).json({order});
  }catch(e){next(e)}
}

export async function createStripeCheckoutSession(req,res,next){
  try{
    const address=req.body?.shippingAddress;
    const err=assertAddress(address);
    if(err) return res.status(400).json({message:err});
    const cart=await getUserCart(req.user._id);
    if(!cart || cart.items.length===0) return res.status(400).json({message:"Cart is empty"});

    const stripe=getStripe();
    const frontend=process.env.FRONTEND_URL || "http://localhost:5173";

    const line_items=cart.items.map(it=>({
      quantity:it.qty,
      price_data:{
        currency:"inr",
        unit_amount:Math.round(it.priceAtAdd*100),
        product_data:{ name:`${it.titleSnapshot} (Size: ${it.size})`, images: it.imageUrlSnapshot ? [it.imageUrlSnapshot] : undefined }
      }
    }));
    const subtotal=cart.items.reduce((s,it)=>s+it.priceAtAdd*it.qty,0);

    const session=await stripe.checkout.sessions.create({
      mode:"payment",
      payment_method_types:["card"],
      line_items,
      success_url:`${frontend}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:`${frontend}/payment/cancel`,
      metadata:{ userId:String(req.user._id), subtotal:String(subtotal) }
    });

    const order=await Order.create({
      user:req.user._id, items:cartToOrderItems(cart), subtotal,
      shippingAddress:address, paymentMethod:"STRIPE", paymentStatus:"PENDING", orderStatus:"PLACED",
      stripeSessionId:session.id
    });

    res.status(201).json({url:session.url, sessionId:session.id, orderId:order._id});
  }catch(e){next(e)}
}

export async function confirmStripePayment(req,res,next){
  try{
    const {sessionId}=req.body||{};
    if(!sessionId) return res.status(400).json({message:"sessionId required"});
    const order=await Order.findOne({user:req.user._id, stripeSessionId:sessionId});
    if(!order) return res.status(404).json({message:"Order not found for this session"});

    const stripe=getStripe();
    const session=await stripe.checkout.sessions.retrieve(sessionId);

    if(session.payment_status==="paid"){
      order.paymentStatus="PAID";
      await order.save();
      const cart=await Cart.findOne({user:req.user._id});
      if(cart){cart.items=[]; await cart.save();}
      return res.json({status:"PAID", order});
    }
    return res.json({status:(session.payment_status||"pending").toUpperCase(), order});
  }catch(e){next(e)}
}

export async function listMyOrders(req,res,next){
  try{
    const orders=await Order.find({user:req.user._id}).sort({createdAt:-1});
    res.json({orders});
  }catch(e){next(e)}
}
export async function getMyOrder(req,res,next){
  try{
    const order=await Order.findOne({_id:req.params.id, user:req.user._id});
    if(!order) return res.status(404).json({message:"Order not found"});
    res.json({order});
  }catch(e){next(e)}
}
