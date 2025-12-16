import Product from "../models/Product.js";

export async function getAllProducts(req, res, next) {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (e) { next(e); }
}

export async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (e) {
    if (e?.name === "CastError") return res.status(400).json({ message: "Invalid product id" });
    next(e);
  }
}
