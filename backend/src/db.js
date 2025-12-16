import mongoose from "mongoose";

export default async function connectDB(uri) {
  if (!uri) throw new Error("MONGODB_URI missing in backend/.env");
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { autoIndex: true });
  console.log("✅ Connected to MongoDB");
}
