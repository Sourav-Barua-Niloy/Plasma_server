import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    unitsNeeded: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    hospital: {
      type: String,
      required: true,
      trim: true,
    },

    // OLD string location — kept temporarily for migration (optional now)
    districtName: {
      type: String,
      trim: true,
    },

    // NEW reference-based location
    division: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Division",
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
    },
    upazila: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Upazila",
    },

    // Free-text area detail
    area: {
      type: String,
      trim: true,
    },

    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    urgency: {
      type: String,
      enum: ["normal", "urgent", "critical"],
      default: "normal",
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "fulfilled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const BloodRequest = mongoose.model("BloodRequest", bloodRequestSchema);

export default BloodRequest;