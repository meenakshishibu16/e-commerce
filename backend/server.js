import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/db.js";
import { seedProductsIfEmpty } from "./src/seed/products.seed.js";

import productRoutes from "./src/routes/products.js";
import authRoutes from "./src/routes/auth.js";
import cartRoutes from "./src/routes/cart.js";
import orderRoutes from "./src/routes/orders.js";
import wishlistRoutes from "./src/routes/wishlist.js";
import reviewRoutes from "./src/routes/reviews.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Phase 4 API running" }));

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
await connectDB(process.env.MONGODB_URI);
await seedProductsIfEmpty();

app.listen(PORT, () => console.log(`✅ Backend on http://localhost:${PORT}`));
