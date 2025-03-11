import mongoose from "mongoose";
import {GridFSBucket} from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((conn) => {
      console.log("Connected to MongoDB Atlas");
      return conn;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

// ✅ Initialize GridFS
export async function getGridFSBucket() {
  const conn = await connectToDatabase();
  return new GridFSBucket(conn.connection.db, { bucketName: "uploads" });
}
