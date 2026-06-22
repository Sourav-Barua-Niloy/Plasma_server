import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// The schema = the blueprint for what a user looks like
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },

    // OLD string location — kept temporarily for migration (optional now)
    districtName: {
      type: String,
      trim: true,
    },

    // NEW reference-based location (optional for now → required after migration)
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

    // Free-text area detail (village / mahalla / ward / street address)
    area: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user", // new users are regular users by default
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    lastDonationDate: {
      type: Date,
      default: null, // null = hasn't recorded a donation yet
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: hash the password automatically before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare a candidate password with the stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;