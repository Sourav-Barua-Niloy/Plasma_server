import mongoose from "mongoose";

// This function connects our server to MongoDB
const connectDB = async () => {
  try {
    // Read the connection string from .env and connect
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    // If connection fails, log the error and stop the server
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // exit with failure
  }
};

export default connectDB;