import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config();

const getMongoDbUri = () => {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI must be defined in environment variables");
  }

  return {
    mongoDbUri: MONGODB_URI,
  };
};

const mongoUri = getMongoDbUri();

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri.mongoDbUri);
    console.log("MongoDB connected successfully via Mongoose!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);

    process.exit(1);
  }
};
