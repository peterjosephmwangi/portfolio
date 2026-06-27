import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };
global.mongoose = cached;

function getMongoURI(): string {
  // Accept either MONGODB_URI or MONGO_URI (both common naming conventions)
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || "";

  if (
    !uri ||
    uri.includes("<password>") ||
    uri.includes("<user>") ||
    uri.includes("xxxxx")
  ) {
    throw new Error(
      "\n\n❌ MongoDB not configured.\n" +
        "Add this to your .env or .env.local file:\n\n" +
        "  MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/portfolio\n\n" +
        "Free cluster: https://cloud.mongodb.com\n"
    );
  }

  return uri;
}

export async function connectDB(): Promise<typeof mongoose> {
  const uri = getMongoURI();

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      })
      .then((m) => m)
      .catch((err) => {
        cached.promise = null; // reset so the next request can retry
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Alias — some route files may use this import name
export const connectToDatabase = connectDB;