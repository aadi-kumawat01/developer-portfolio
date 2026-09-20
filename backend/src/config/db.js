import mongoose from "mongoose";

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    console.warn("MongoDB URI is not configured. Starting without a database connection.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected.");
  } catch (error) {
    console.error("MongoDB connection failed.");
    throw error;
  }
}

export default connectDB;
