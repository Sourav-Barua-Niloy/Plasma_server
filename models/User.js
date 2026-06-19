import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

// Pre-save hook: hash the password automatically before saving
userSchema.pre("save", async function () {
  // Only hash if the password was changed (or is new)
  if (!this.isModified("password")) {
    return;
  }

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare a candidate password with the stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// The model = the tool we use to work with users in the database
const User = mongoose.model("User", userSchema);

export default User;