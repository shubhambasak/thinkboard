import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error(
      "MONGO_URI is not set. Add it to .env (e.g. MongoDB Atlas or local: mongodb://localhost:27017/thinkboard)"
    );
  }
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw new Error(
      "Cannot connect to MongoDB. Is it running? For local: start MongoDB. For cloud: use a MongoDB Atlas connection string in .env as MONGO_URI."
    );
  }
};
