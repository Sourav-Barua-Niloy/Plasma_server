import mongoose from "mongoose";
import dotenv from "dotenv";
import BloodRequest from "../models/BloodRequest.js";
import User from "../models/User.js";

dotenv.config();

const seedRequests = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Find any existing user to attach requests to
    const user = await User.findOne();
    if (!user) {
      console.log("❌ No users found. Register a user first, then run this.");
      process.exit(1);
    }
    console.log(`Using user: ${user.name} (${user._id})`);

    // The dummy requests
    const dummyRequests = [
      {
        patientName: "Karim Ahmed",
        bloodGroup: "O+",
        unitsNeeded: 2,
        hospital: "Dhaka Medical College Hospital",
        district: "Dhaka",
        contactPhone: "01711111111",
        urgency: "critical",
        note: "Emergency surgery scheduled tonight.",
        requestedBy: user._id,
      },
      {
        patientName: "Fatima Begum",
        bloodGroup: "A+",
        unitsNeeded: 1,
        hospital: "Chittagong Medical College",
        district: "Chattogram",
        contactPhone: "01722222222",
        urgency: "urgent",
        note: "Needed within 24 hours.",
        requestedBy: user._id,
      },
      {
        patientName: "Rahim Khan",
        bloodGroup: "B+",
        unitsNeeded: 3,
        hospital: "Sylhet MAG Osmani Medical College",
        district: "Sylhet",
        contactPhone: "01733333333",
        urgency: "normal",
        note: "",
        requestedBy: user._id,
      },
      {
        patientName: "Nadia Islam",
        bloodGroup: "AB-",
        unitsNeeded: 2,
        hospital: "Rajshahi Medical College",
        district: "Rajshahi",
        contactPhone: "01744444444",
        urgency: "critical",
        note: "Rare blood type, please help urgently.",
        requestedBy: user._id,
      },
      {
        patientName: "Sajid Hasan",
        bloodGroup: "O-",
        unitsNeeded: 1,
        hospital: "Khulna Medical College",
        district: "Khulna",
        contactPhone: "01755555555",
        urgency: "urgent",
        note: "For a road accident victim.",
        requestedBy: user._id,
      },
      {
        patientName: "Ayesha Siddiqua",
        bloodGroup: "A-",
        unitsNeeded: 2,
        hospital: "Cumilla Medical College",
        district: "Cumilla",
        contactPhone: "01766666666",
        urgency: "normal",
        note: "Scheduled operation next week.",
        requestedBy: user._id,
      },
    ];

    // Insert them all
    await BloodRequest.insertMany(dummyRequests);
    console.log(`✅ Inserted ${dummyRequests.length} dummy blood requests`);

    // Close the connection and exit
    await mongoose.connection.close();
    console.log("✅ Done. Connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedRequests();