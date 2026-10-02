import mongoose from "mongoose";

const globalWithMongoose = global as typeof global & {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

export const connectDB = async (): Promise<string> => {
  if (cached.conn) {
    return "Already connected to database";
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI_IBYTRADE_GOAPI!, { serverSelectionTimeoutMS: 10000 })
      .then((mongoose) => {
        return mongoose;
      });
  }
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  return "Connected to database with success";
};