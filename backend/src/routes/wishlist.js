import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlistController.js";

const router = Router();
router.get("/", authRequired, getWishlist);
router.post("/:productId", authRequired, addToWishlist);
router.delete("/:productId", authRequired, removeFromWishlist);

export default router;
