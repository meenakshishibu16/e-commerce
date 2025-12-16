import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/db.js";
import productRoutes from "./src/routes/products.js";
import cartRoutes from "./src/routes/cart.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Phase 2 API running" }));

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
await connectDB(process.env.MONGODB_URI);

app.listen(PORT, () => console.log(`✅ Backend on http://localhost:${PORT}`));
