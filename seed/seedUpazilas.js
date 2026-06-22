import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import District from "../models/District.js";
import Upazila from "../models/Upazila.js";

dotenv.config();

const seedUpazilas = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // 1. Load the dataset file (place your JSON at seed/upazilas.json)
    const raw = fs.readFileSync(new URL("./upazilas.json", import.meta.url));
    const data = JSON.parse(raw);
    console.log(`📂 Loaded ${data.length} upazila records from file`);

    // 2. Build a district NAME → _id map (lowercased for safe matching)
    const districts = await District.find();
    const districtMap = {};
    for (const d of districts) {
      districtMap[d.name.toLowerCase().trim()] = d._id;
    }
    console.log(`🗺️  Mapped ${districts.length} districts`);

    // 3. Clear existing upazilas so re-running is safe
    await Upazila.deleteMany({});
    console.log("🧹 Cleared old upazilas");

    // 4. Build the upazila docs, matching each to its district
    const toInsert = [];
    const skipped = [];

    for (const item of data) {
      const districtName = (item.district || "").toLowerCase().trim();
      const districtId = districtMap[districtName];

      if (!districtId) {
        skipped.push(`${item.name} (district "${item.district}" not found)`);
        continue;
      }

      toInsert.push({
        name: item.name.trim(),
        district: districtId,
      });
    }

    // 5. Insert all valid upazilas at once
    if (toInsert.length > 0) {
      await Upazila.insertMany(toInsert);
    }

    console.log(`✅ Inserted ${toInsert.length} upazilas`);

    if (skipped.length > 0) {
      console.log(`⚠️  Skipped ${skipped.length} (district name mismatch):`);
      skipped.slice(0, 20).forEach((s) => console.log(`   - ${s}`));
      if (skipped.length > 20) console.log(`   ...and ${skipped.length - 20} more`);
    }

    await mongoose.connection.close();
    console.log("✅ Done. Connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedUpazilas();