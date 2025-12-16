import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Cart from "../models/Cart.js";
import { computeTotals } from "../utils/totals.js";

function signToken(userId){
  const secret=process.env.JWT_SECRET;
  if(!secret) throw new Error("JWT_SECRET missing in backend/.env");
  return jwt.sign({sub:userId}, secret, {expiresIn:"7d"});
}
async function getOrCreateUserCart(userId){
  let cart=await Cart.findOne({user:userId});
  if(!cart) cart=await Cart.create({user:userId,items:[]});
  return cart;
}

export async function register(req,res,next){
  try{
    const {name,email,password}=req.body||{};
    if(!name||!email||!password) return res.status(400).json({message:"name, email, password required"});
    if(String(password).length<6) return res.status(400).json({message:"Password must be at least 6 characters"});
    const exists=await User.findOne({email:String(email).toLowerCase()});
    if(exists) return res.status(409).json({message:"Email already in use"});
    const passwordHash=await bcrypt.hash(password,10);
    const user=await User.create({name,email,passwordHash});
    await Cart.create({user:user._id,items:[]});
    const token=signToken(user._id);
    res.status(201).json({token,user:{id:user._id,name:user.name,email:user.email}});
  }catch(e){next(e)}
}

export async function login(req,res,next){
  try{
    const {email,password,guestCartId}=req.body||{};
    if(!email||!password) return res.status(400).json({message:"email and password required"});
    const user=await User.findOne({email:String(email).toLowerCase()});
    if(!user) return res.status(401).json({message:"Invalid credentials"});
    const ok=await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(401).json({message:"Invalid credentials"});
    const userCart=await getOrCreateUserCart(user._id);

    if(guestCartId){
      const guest=await Cart.findOne({cartId:guestCartId});
      if(guest && guest.items.length){
        for(const it of guest.items){
          const existing=userCart.items.find(x=>String(x.product)===String(it.product)&&x.size===it.size);
          if(existing) existing.qty += it.qty;
          else userCart.items.push({
            product:it.product,size:it.size,qty:it.qty,
            priceAtAdd:it.priceAtAdd,titleSnapshot:it.titleSnapshot,imageUrlSnapshot:it.imageUrlSnapshot
          });
        }
        await userCart.save();
        guest.items=[];
        await guest.save();
      }
    }

    const token=signToken(user._id);
    res.json({token,user:{id:user._id,name:user.name,email:user.email,isAdmin:user.isAdmin},cart:userCart,totals:computeTotals(userCart)});
  }catch(e){next(e)}
}

export async function me(req,res){res.json({user:req.user});}
