import jwt from "jsonwebtoken";
import User from "../models/User.js";
export async function authRequired(req,res,next){
  try{
    const header=req.headers.authorization||"";
    const [type,token]=header.split(" ");
    if(type!=="Bearer"||!token) return res.status(401).json({message:"Missing Authorization Bearer token"});
    const payload=jwt.verify(token, process.env.JWT_SECRET);
    const user=await User.findById(payload.sub).select("-passwordHash");
    if(!user) return res.status(401).json({message:"Invalid token user"});
    req.user=user;
    next();
  }catch{
    return res.status(401).json({message:"Invalid or expired token"});
  }
}
