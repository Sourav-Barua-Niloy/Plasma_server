import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import District from "../models/District.js";

dotenv.config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Build a district NAME → { id, division } map (lowercased for matching)
    const districts = await District.find();
    const districtMap = {};
    for (const d of districts) {
      districtMap[d.name.toLowerCase().trim()] = {
        districtId: d._id,
        divisionId: d.division,
      };
    }
    console.log(`🗺️  Mapped ${districts.length} districts`);

    // Find users who still need migration:
    // they have a districtName but no district reference yet
    const usersToMigrate = await User.find({
      districtName: { $exists: true, $ne: null, $ne: "" },
      district: { $in: [null, undefined] },
    });

    console.log(`👥 Found ${usersToMigrate.length} users to migrate`);

    let migrated = 0;
    const unmatched = [];

    for (const user of usersToMigrate) {
      const key = user.districtName.toLowerCase().trim();
      const match = districtMap[key];

      if (!match) {
        unmatched.push(`${user.email} (district "${user.districtName}")`);
        continue;
      }

      user.district = match.districtId;
      user.division = match.divisionId;
      await user.save(); // password won't re-hash (isModified check)
      migrated++;
    }

    console.log(`✅ Migrated ${migrated} users`);

    if (unmatched.length > 0) {
      console.log(`⚠️  ${unmatched.length} users had unmatched districts:`);
      unmatched.forEach((u) => console.log(`   - ${u}`));
      console.log("   (Fix their districtName spelling, or update them manually.)");
    }

    await mongoose.connection.close();
    console.log("✅ Done. Connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
};

migrate();