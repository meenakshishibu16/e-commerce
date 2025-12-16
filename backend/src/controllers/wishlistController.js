import Wishlist from "../models/Wishlist.js";

export async function getWishlist(req, res, next) {
  try {
    const wl = await Wishlist.findOne({ user: req.user._id }).populate("products");
    res.json({ wishlist: wl?.products || [] });
  } catch (e) { next(e); }
}

export async function addToWishlist(req, res, next) {
  try {
    const { productId } = req.params;
    const wl = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $addToSet: { products: productId } },
      { upsert: true, new: true }
    ).populate("products");
    res.json({ wishlist: wl.products });
  } catch (e) { next(e); }
}

export async function removeFromWishlist(req, res, next) {
  try {
    const { productId } = req.params;
    const wl = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { products: productId } },
      { new: true }
    ).populate("products");
    res.json({ wishlist: wl?.products || [] });
  } catch (e) { next(e); }
}
