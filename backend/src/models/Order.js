import mongoose from "mongoose";
const orderItemSchema=new mongoose.Schema({
  product:{type:mongoose.Schema.Types.ObjectId,ref:"Product"},
  size:{type:String,required:true},
  qty:{type:Number,required:true,min:1},
  price:{type:Number,required:true,min:0},
  title:{type:String,required:true},
  imageUrl:{type:String,default:""},
},{_id:false});
const addressSchema=new mongoose.Schema({
  fullName:{type:String,required:true},
  phone:{type:String,required:true},
  line1:{type:String,required:true},
  line2:{type:String,default:""},
  city:{type:String,required:true},
  state:{type:String,required:true},
  pincode:{type:String,required:true},
  country:{type:String,default:"India"},
},{_id:false});
const orderSchema=new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,index:true},
  items:{type:[orderItemSchema],default:[]},
  subtotal:{type:Number,required:true,min:0},
  shippingAddress:{type:addressSchema,required:true},
  paymentMethod:{type:String,enum:["COD","STRIPE"],required:true},
  paymentStatus:{type:String,enum:["PENDING","PAID","FAILED"],default:"PENDING"},
  orderStatus:{type:String,enum:["PLACED","PROCESSING","SHIPPED","DELIVERED","CANCELLED"],default:"PLACED"},
  stripeSessionId:{type:String,default:""},
},{timestamps:true});
export default mongoose.model("Order",orderSchema);
