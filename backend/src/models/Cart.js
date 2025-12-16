import mongoose from "mongoose";
const cartItemSchema=new mongoose.Schema({
  product:{type:mongoose.Schema.Types.ObjectId,ref:"Product",required:true},
  size:{type:String,required:true},
  qty:{type:Number,required:true,min:1,default:1},
  priceAtAdd:{type:Number,required:true,min:0},
  titleSnapshot:{type:String,required:true},
  imageUrlSnapshot:{type:String,default:""},
},{timestamps:true});
const cartSchema=new mongoose.Schema({
  cartId:{type:String,unique:true,sparse:true,index:true},
  user:{type:mongoose.Schema.Types.ObjectId,ref:"User",unique:true,sparse:true,index:true},
  items:{type:[cartItemSchema],default:[]},
},{timestamps:true});
export default mongoose.model("Cart",cartSchema);
