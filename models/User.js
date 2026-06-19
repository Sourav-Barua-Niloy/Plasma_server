import mongoose from "mongoose";

// The schema = the blueprint for what a user looks like
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // removes accidental spaces at start/end
    },
    email: {
      type: String,
      required: true,
      unique: true, // no two users can share an email
      lowercase: true, // always store emails in lowercase
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // basic length rule
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], // only these allowed
    },
    district: {
      type: String,
      required: true,
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
      default: true, // donors are available by default
    },
  },
  {
    timestamps: true, // auto-adds createdAt and updatedAt fields
  }
);

// The model = the tool we use to work with users in the database
const User = mongoose.model("User", userSchema);

export default User;