import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Load environment variables from .env FIRST
dotenv.config();

// Connect to the database
connectDB();

// Create the Express app
const app = express();
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Plasma server is running!" });
});

// Use the PORT from .env, or fall back to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});