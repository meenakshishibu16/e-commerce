import Product from "../models/Product.js";

const SEED_PRODUCTS=[
  {title:"Classic Cotton T‑Shirt",description:"Soft, breathable cotton tee for everyday wear.",category:"Clothing",price:499,imageUrl:"https://cdn.media.amplience.net/i/lmg/51031014Grey-51031014GreyAW22CP170822_01-2100.jpg?fmt=auto&$quality-standard$&sm=c&$prodimg-m-prt-pdp-2x$",tags:["cotton","daily","basic"],sizes:[{size:"S",stock:10},{size:"M",stock:12},{size:"L",stock:8},{size:"XL",stock:6}]},
  {title:"Minimal Sneakers",description:"Clean design sneakers, comfortable for long walks.",category:"Footwear",price:1899,imageUrl:"https://thegoodmanbrand.com/cdn/shop/files/edge-lo-top-sneaker-mono-responsible-nappa-leather-sneakers-good-man-brand-white-8-15_8a67d47f-6e84-45d6-bfc9-3dc74e228fc9.jpg?v=1744744545&width=2000",tags:["shoes","minimal","comfort"],sizes:[{size:"7",stock:7},{size:"8",stock:10},{size:"9",stock:9},{size:"10",stock:5}]},
  {title:"Leather Wallet",description:"Slim genuine-leather wallet with multiple slots.",category:"Accessories",price:999,imageUrl:"https://limico.ae/cdn/shop/files/DSC_35142_f58a4034-a863-4c3b-b95c-6a7a9b73441f.jpg?v=1704487234&width=1946",tags:["leather","slim","gift"],sizes:[{size:"One Size",stock:25}]},
  {title:"Wireless Headphones",description:"Over-ear headphones with rich bass and long battery life.",category:"Electronics",price:3499,imageUrl:"https://sony.scene7.com/is/image/sonyglobalsolutions/Headphones_Product-finder_WH-1000XM6?$productFinder$&fmt=png-alpha",tags:["audio","wireless","music"],sizes:[{size:"Standard",stock:15}]},
];

export async function seedProductsIfEmpty() {
  const count = await Product.countDocuments();
  if (count > 0) {
    console.log(`🟦 Products already exist (${count}). Skipping seed.`);
    return;
  }

  await Product.insertMany(SEED_PRODUCTS);
  console.log(`✅ Seeded ${SEED_PRODUCTS.length} products.`);
}
