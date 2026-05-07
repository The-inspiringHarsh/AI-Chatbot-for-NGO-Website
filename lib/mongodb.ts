import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

type CachedConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = global as typeof globalThis & {
  mongooseCache?: CachedConnection;
};

const cached =
  globalWithMongoose.mongooseCache ??
  (globalWithMongoose.mongooseCache = { conn: null, promise: null });

export async function connectToDatabase() {
  if (!uri) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  cached.promise ??= mongoose.connect(uri, {
    dbName: "amaanitvam-chatbot",
    bufferCommands: false
  });

  cached.conn = await cached.promise;
  return cached.conn;
}
