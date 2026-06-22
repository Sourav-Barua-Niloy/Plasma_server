import mongoose from "mongoose";

const upazilaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      required: true,
    },
  },
  { timestamps: true }
);

const Upazila = mongoose.model("Upazila", upazilaSchema);

export default Upazila;