import mongoose from "mongoose";
import dotenv from "dotenv";
import BloodRequest from "../models/BloodRequest.js";
import User from "../models/User.js";
import District from "../models/District.js";
import Upazila from "../models/Upazila.js";

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

    // Helper: resolve a district name → { division, district, upazila } references
    const buildLocation = async (districtName) => {
      const district = await District.findOne({ name: districtName });
      if (!district) return null;
      // grab one upazila in that district (if any exist)
      const upazila = await Upazila.findOne({ district: district._id });
      return {
        division: district.division, // district already references its division
        district: district._id,
        upazila: upazila ? upazila._id : undefined,
      };
    };

    // Request specs (district given by NAME — resolved to refs below)
    const specs = [
      {
        patientName: "Karim Ahmed",
        bloodGroup: "O+",
        unitsNeeded: 2,
        hospital: "Dhaka Medical College Hospital",
        districtName: "Dhaka",
        contactPhone: "01711111111",
        urgency: "critical",
        note: "Emergency surgery scheduled tonight.",
      },
      {
        patientName: "Fatima Begum",
        bloodGroup: "A+",
        unitsNeeded: 1,
        hospital: "Chittagong Medical College",
        districtName: "Chattogram",
        contactPhone: "01722222222",
        urgency: "urgent",
        note: "Needed within 24 hours.",
      },
      {
        patientName: "Rahim Khan",
        bloodGroup: "B+",
        unitsNeeded: 3,
        hospital: "Sylhet MAG Osmani Medical College",
        districtName: "Sylhet",
        contactPhone: "01733333333",
        urgency: "normal",
        note: "",
      },
      {
        patientName: "Nadia Islam",
        bloodGroup: "AB-",
        unitsNeeded: 2,
        hospital: "Rajshahi Medical College",
        districtName: "Rajshahi",
        contactPhone: "01744444444",
        urgency: "critical",
        note: "Rare blood type, please help urgently.",
      },
      {
        patientName: "Sajid Hasan",
        bloodGroup: "O-",
        unitsNeeded: 1,
        hospital: "Khulna Medical College",
        districtName: "Khulna",
        contactPhone: "01755555555",
        urgency: "urgent",
        note: "For a road accident victim.",
      },
      {
        patientName: "Ayesha Siddiqua",
        bloodGroup: "A-",
        unitsNeeded: 2,
        hospital: "Cumilla Medical College",
        districtName: "Cumilla",
        contactPhone: "01766666666",
        urgency: "normal",
        note: "Scheduled operation next week.",
      },
    ];

    // Clear old requests so re-running is clean (no duplicates)
    await BloodRequest.deleteMany({});
    console.log("🧹 Cleared old blood requests");

    // Build the docs, resolving each district name to references
    const docs = [];
    const skipped = [];

    for (const spec of specs) {
      const loc = await buildLocation(spec.districtName);
      if (!loc) {
        skipped.push(spec.districtName);
        continue;
      }

      docs.push({
        patientName: spec.patientName,
        bloodGroup: spec.bloodGroup,
        unitsNeeded: spec.unitsNeeded,
        hospital: spec.hospital,
        division: loc.division,
        district: loc.district,
        upazila: loc.upazila,
        contactPhone: spec.contactPhone,
        urgency: spec.urgency,
        note: spec.note,
        requestedBy: user._id,
      });
    }

    // Insert all valid requests
    if (docs.length > 0) {
      await BloodRequest.insertMany(docs);
    }
    console.log(`✅ Inserted ${docs.length} blood requests`);

    if (skipped.length > 0) {
      console.log(`⚠️  Skipped (district not found): ${skipped.join(", ")}`);
      console.log("   Make sure these districts exist in your seeded data.");
    }

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