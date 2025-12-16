import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { getReviews, upsertReview } from "../controllers/reviewController.js";

const router = Router();
router.get("/:productId", getReviews);
router.post("/:productId", authRequired, upsertReview);

export default router;
