import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import { SUPERADMIN_EMAIL } from "../config/roles.js";

dotenv.config();

const makeSuperadmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const user = await User.findOne({ email: SUPERADMIN_EMAIL });
    if (!user) {
      console.log(`❌ No user found with email ${SUPERADMIN_EMAIL}`);
      console.log("   Register that account first, then re-run this.");
      process.exit(1);
    }

    if (user.role === "superadmin") {
      console.log(`ℹ️  ${SUPERADMIN_EMAIL} is already superadmin.`);
    } else {
      user.role = "superadmin";
      await user.save(); // isModified("password") prevents re-hash
      console.log(`✅ ${SUPERADMIN_EMAIL} is now superadmin.`);
    }

    await mongoose.connection.close();
    console.log("✅ Done. Connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed:", error.message);
    process.exit(1);
  }
};

makeSuperadmin();