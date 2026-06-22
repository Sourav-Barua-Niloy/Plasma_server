import mongoose from "mongoose";
import dotenv from "dotenv";
import Division from "../models/Division.js";
import District from "../models/District.js";

dotenv.config();

// 8 divisions
const divisions = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

// Districts grouped by their division
const districtsByDivision = {
  Dhaka: [
    "Dhaka", "Faridpur", "Gazipur", "Gopalganj", "Kishoreganj", "Madaripur",
    "Manikganj", "Munshiganj", "Narayanganj", "Narsingdi", "Rajbari",
    "Shariatpur", "Tangail",
  ],
  Chattogram: [
    "Chattogram", "Bandarban", "Brahmanbaria", "Chandpur", "Cumilla",
    "Cox's Bazar", "Feni", "Khagrachhari", "Lakshmipur", "Noakhali",
    "Rangamati",
  ],
  Rajshahi: [
    "Rajshahi", "Bogura", "Joypurhat", "Naogaon", "Natore",
    "Chapainawabganj", "Pabna", "Sirajganj",
  ],
  Khulna: [
    "Khulna", "Bagerhat", "Chuadanga", "Jashore", "Jhenaidah", "Kushtia",
    "Magura", "Meherpur", "Narail", "Satkhira",
  ],
  Barishal: [
    "Barishal", "Barguna", "Bhola", "Jhalokati", "Patuakhali", "Pirojpur",
  ],
  Sylhet: ["Sylhet", "Habiganj", "Moulvibazar", "Sunamganj"],
  Rangpur: [
    "Rangpur", "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat",
    "Nilphamari", "Panchagarh", "Thakurgaon",
  ],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
};

const seedLocations = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing location data so re-running is safe
    await District.deleteMany({});
    await Division.deleteMany({});
    console.log("🧹 Cleared old divisions & districts");

    // Insert divisions, then build a name → _id map
    const divisionMap = {};
    for (const name of divisions) {
      const div = await Division.create({ name });
      divisionMap[name] = div._id;
    }
    console.log(`✅ Inserted ${divisions.length} divisions`);

    // Insert districts, each linked to its division's _id
    let districtCount = 0;
    for (const [divisionName, districtNames] of Object.entries(districtsByDivision)) {
      for (const districtName of districtNames) {
        await District.create({
          name: districtName,
          division: divisionMap[divisionName],
        });
        districtCount++;
      }
    }
    console.log(`✅ Inserted ${districtCount} districts`);

    await mongoose.connection.close();
    console.log("✅ Done. Connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedLocations();