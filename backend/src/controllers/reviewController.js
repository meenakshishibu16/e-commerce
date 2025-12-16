import Review from "../models/Review.js";
import Order from "../models/Order.js";

export async function getReviews(req, res, next) {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const avg =
      reviews.length === 0 ? 0 :
      reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

    res.json({ reviews, avgRating: avg, count: reviews.length });
  } catch (e) { next(e); }
}

async function hasBought(userId, productId) {
  const order = await Order.findOne({
    user: userId,
    "items.product": productId
  }).select("_id");
  return !!order;
}

export async function upsertReview(req, res, next) {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body || {};

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "rating must be 1-5" });
    }

    const ok = await hasBought(req.user._id, productId);
    if (!ok) {
      return res.status(403).json({ message: "Only verified buyers can review this product." });
    }

    const review = await Review.findOneAndUpdate(
      { user: req.user._id, product: productId },
      { rating, comment },
      { upsert: true, new: true }
    );

    res.status(201).json({ review });
  } catch (e) {
    // handle unique index edge-case safely
    next(e);
  }
}
