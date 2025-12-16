import crypto from "crypto";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { computeTotals } from "../utils/totals.js";

function newCartId(){return crypto.randomBytes(16).toString("hex");}
async function getOrCreateGuestCart(cartId){let c=await Cart.findOne({cartId}); if(!c) c=await Cart.create({cartId,items:[]}); return c;}
async function getOrCreateUserCart(userId){let c=await Cart.findOne({user:userId}); if(!c) c=await Cart.create({user:userId,items:[]}); return c;}
function validateSize(product,size){const e=(product.sizes||[]).find(s=>(s.size||"").toLowerCase()===String(size).toLowerCase()); return e?.size||null;}

async function addItemToCart(cart, productId, size, qty){
  const product=await Product.findById(productId);
  if(!product) return {error:{status:404,message:"Product not found"}};
  const normalized=validateSize(product,size);
  if(!normalized) return {error:{status:400,message:"Invalid size for this product"}};
  const safeQty=Math.max(1,Number(qty||1));
  const existing=cart.items.find(it=>String(it.product)===String(product._id)&&it.size===normalized);
  if(existing) existing.qty += safeQty;
  else cart.items.push({product:product._id,size:normalized,qty:safeQty,priceAtAdd:product.price,titleSnapshot:product.title,imageUrlSnapshot:product.imageUrl});
  await cart.save();
  return {cart};
}

export async function guestCreate(req,res,next){try{const cartId=newCartId(); const cart=await Cart.create({cartId,items:[]}); res.status(201).json({cartId,cart,totals:computeTotals(cart)});}catch(e){next(e)}}
export async function guestGet(req,res,next){try{const cart=await getOrCreateGuestCart(req.params.cartId); res.json({cartId:cart.cartId,cart,totals:computeTotals(cart)});}catch(e){next(e)}}
export async function guestAddItem(req,res,next){try{const {productId,size,qty}=req.body||{}; if(!productId||!size) return res.status(400).json({message:"productId and size required"}); const cart=await getOrCreateGuestCart(req.params.cartId); const out=await addItemToCart(cart,productId,size,qty); if(out.error) return res.status(out.error.status).json({message:out.error.message}); res.json({cartId:cart.cartId,cart,totals:computeTotals(cart)});}catch(e){next(e)}}
export async function guestUpdateQty(req,res,next){try{const cart=await getOrCreateGuestCart(req.params.cartId); const item=cart.items.id(req.params.itemId); if(!item) return res.status(404).json({message:"Item not found"}); item.qty=Math.max(1,Number(req.body?.qty||1)); await cart.save(); res.json({cartId:cart.cartId,cart,totals:computeTotals(cart)});}catch(e){next(e)}}
export async function guestRemove(req,res,next){try{const cart=await getOrCreateGuestCart(req.params.cartId); const item=cart.items.id(req.params.itemId); if(!item) return res.status(404).json({message:"Item not found"}); item.deleteOne(); await cart.save(); res.json({cartId:cart.cartId,cart,totals:computeTotals(cart)});}catch(e){next(e)}}
export async function guestClear(req,res,next){try{const cart=await getOrCreateGuestCart(req.params.cartId); cart.items=[]; await cart.save(); res.json({cartId:cart.cartId,cart,totals:computeTotals(cart)});}catch(e){next(e)}}

export async function userGet(req,res,next){try{const cart=await getOrCreateUserCart(req.user._id); res.json({cart,totals:computeTotals(cart)});}catch(e){next(e)}}
export async function userAddItem(req,res,next){try{const {productId,size,qty}=req.body||{}; if(!productId||!size) return res.status(400).json({message:"productId and size required"}); const cart=await getOrCreateUserCart(req.user._id); const out=await addItemToCart(cart,productId,size,qty); if(out.error) return res.status(out.error.status).json({message:out.error.message}); res.json({cart,totals:computeTotals(cart)});}catch(e){next(e)}}
export async function userUpdateQty(req,res,next){try{const cart=await getOrCreateUserCart(req.user._id); const item=cart.items.id(req.params.itemId); if(!item) return res.status(404).json({message:"Item not found"}); item.qty=Math.max(1,Number(req.body?.qty||1)); await cart.save(); res.json({cart,totals:computeTotals(cart)});}catch(e){next(e)}}
export async function userRemove(req,res,next){try{const cart=await getOrCreateUserCart(req.user._id); const item=cart.items.id(req.params.itemId); if(!item) return res.status(404).json({message:"Item not found"}); item.deleteOne(); await cart.save(); res.json({cart,totals:computeTotals(cart)});}catch(e){next(e)}}
export async function userClear(req,res,next){try{const cart=await getOrCreateUserCart(req.user._id); cart.items=[]; await cart.save(); res.json({cart,totals:computeTotals(cart)});}catch(e){next(e)}}
