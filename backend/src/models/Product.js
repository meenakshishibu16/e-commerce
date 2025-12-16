import mongoose from "mongoose";
const sizeSchema=new mongoose.Schema({size:{type:String,required:true,trim:true},stock:{type:Number,required:true,min:0,default:0}},{_id:false});
const productSchema=new mongoose.Schema({
  title:{type:String,required:true,trim:true},
  description:{type:String,default:""},
  category:{type:String,required:true,trim:true},
  price:{type:Number,required:true,min:0},
  imageUrl:{type:String,default:""},
  tags:[{type:String}],
  sizes:{type:[sizeSchema],default:[]},
},{timestamps:true});
export default mongoose.model("Product",productSchema);
