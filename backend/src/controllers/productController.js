import Product from "../models/Product.js";
export async function getAllProducts(req,res,next){try{res.json(await Product.find({}).sort({createdAt:-1}));}catch(e){next(e)}}
export async function getProductById(req,res,next){
  try{
    const product=await Product.findById(req.params.id);
    if(!product) return res.status(404).json({message:"Product not found"});
    res.json(product);
  }catch(e){
    if(e?.name==="CastError") return res.status(400).json({message:"Invalid product id"});
    next(e);
  }
}
