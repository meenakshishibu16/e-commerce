import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./src/db.js";
import Product from "./src/models/Product.js";

dotenv.config();

const sampleProducts = [
  { title:"Classic Cotton T‑Shirt", description:"Soft, breathable cotton tee for everyday wear.", category:"Clothing", price:499,
    imageUrl:"https://picsum.photos/seed/tshirt/800/800", tags:["cotton","daily","basic"],
    sizes:[{size:"S",stock:10},{size:"M",stock:12},{size:"L",stock:8},{size:"XL",stock:6}] },
  { title:"Minimal Sneakers", description:"Clean design sneakers, comfortable for long walks.", category:"Footwear", price:1899,
    imageUrl:"https://picsum.photos/seed/sneakers/800/800", tags:["shoes","minimal","comfort"],
    sizes:[{size:"7",stock:7},{size:"8",stock:10},{size:"9",stock:9},{size:"10",stock:5}] },
  { title:"Leather Wallet", description:"Slim genuine-leather wallet with multiple slots.", category:"Accessories", price:999,
    imageUrl:"https://picsum.photos/seed/wallet/800/800", tags:["leather","slim","gift"], sizes:[{size:"One Size",stock:25}] },
  { title:"Wireless Headphones", description:"Over-ear headphones with rich bass and long battery life.", category:"Electronics", price:3499,
    imageUrl:"https://picsum.photos/seed/headphones/800/800", tags:["audio","wireless","music"], sizes:[{size:"Standard",stock:15}] }
];

async function run() {
  await connectDB(process.env.MONGODB_URI);
  await Product.deleteMany({});
  const created = await Product.insertMany(sampleProducts);
  console.log(`✅ Seeded ${created.length} products (with sizes)`);
  await mongoose.connection.close();
  process.exit(0);
}

run().catch(async (e) => {
  console.error(e);
  try { await mongoose.connection.close(); } catch {}
  process.exit(1);
});
