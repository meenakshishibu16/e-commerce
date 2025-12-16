import crypto from "crypto";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

function newCartId() { return crypto.randomBytes(16).toString("hex"); }
function totals(cart) {
  const subtotal = cart.items.reduce((s, it) => s + it.priceAtAdd * it.qty, 0);
  const itemCount = cart.items.reduce((s, it) => s + it.qty, 0);
  return { subtotal, itemCount };
}

export async function health(req, res) { res.json({ ok: true }); }

export async function createCart(req, res, next) {
  try {
    const cartId = newCartId();
    const cart = await Cart.create({ cartId, items: [] });
    res.status(201).json({ cartId, cart, totals: totals(cart) });
  } catch (e) { next(e); }
}

export async function getCart(req, res, next) {
  try {
    const { cartId } = req.params;
    const cart = await Cart.findOne({ cartId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json({ cartId: cart.cartId, cart, totals: totals(cart) });
  } catch (e) { next(e); }
}

export async function addItem(req, res, next) {
  try {
    const { cartId } = req.params;
    const { productId, size, qty } = req.body;
    if (!productId || !size) return res.status(400).json({ message: "productId and size are required" });
    const safeQty = Math.max(1, Number(qty || 1));

    const cart = await Cart.findOne({ cartId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const sizeEntry = (product.sizes || []).find(s => (s.size || "").toLowerCase() === String(size).toLowerCase());
    if (!sizeEntry) return res.status(400).json({ message: "Invalid size for this product" });

    const existing = cart.items.find(it => String(it.product) === String(product._id) && it.size === sizeEntry.size);
    if (existing) existing.qty += safeQty;
    else cart.items.push({
      product: product._id,
      size: sizeEntry.size,
      qty: safeQty,
      priceAtAdd: product.price,
      titleSnapshot: product.title,
      imageUrlSnapshot: product.imageUrl,
    });

    await cart.save();
    res.json({ cartId: cart.cartId, cart, totals: totals(cart) });
  } catch (e) { next(e); }
}

export async function updateItemQty(req, res, next) {
  try {
    const { cartId, itemId } = req.params;
    const safeQty = Math.max(1, Number(req.body?.qty || 1));

    const cart = await Cart.findOne({ cartId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.qty = safeQty;
    await cart.save();
    res.json({ cartId: cart.cartId, cart, totals: totals(cart) });
  } catch (e) { next(e); }
}

export async function removeItem(req, res, next) {
  try {
    const { cartId, itemId } = req.params;
    const cart = await Cart.findOne({ cartId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.deleteOne();
    await cart.save();
    res.json({ cartId: cart.cartId, cart, totals: totals(cart) });
  } catch (e) { next(e); }
}

export async function clearCart(req, res, next) {
  try {
    const { cartId } = req.params;
    const cart = await Cart.findOne({ cartId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();
    res.json({ cartId: cart.cartId, cart, totals: totals(cart) });
  } catch (e) { next(e); }
}
