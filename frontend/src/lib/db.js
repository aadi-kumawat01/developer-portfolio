import mongoose from "mongoose";

const cache = globalThis.__portfolioMongoose ??= { connection: null, promise: null };

export async function connectDB() {
  if (cache.connection?.connection.readyState === 1) return cache.connection;
  if (cache.connection) {
    cache.connection = null;
    cache.promise = null;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured.");

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, { bufferCommands: false }).catch(() => {
      cache.promise = null;
      throw new Error("MongoDB connection failed. Check configuration and network access.");
    });
  }

  cache.connection = await cache.promise;
  return cache.connection;
}
