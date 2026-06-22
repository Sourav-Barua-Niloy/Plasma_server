import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

// 👇 Change this to the email of the user you want to make admin
const ADMIN_EMAIL = "admin@plasma.com";

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const user = await User.findOne({ email: ADMIN_EMAIL });
    if (!user) {
      console.log(`❌ No user found with email: ${ADMIN_EMAIL}`);
      process.exit(1);
    }

    user.role = "admin";
    await user.save();

    console.log(`✅ ${user.name} (${user.email}) is now an admin.`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed:", error.message);
    process.exit(1);
  }
};

makeAdmin();