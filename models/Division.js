import mongoose from "mongoose";

const divisionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Division = mongoose.model("Division", divisionSchema);

export default Division;