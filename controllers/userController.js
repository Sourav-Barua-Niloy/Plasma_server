import User from "../models/User.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { registerSchema } from "../validators/userValidator.js";

// Controller: handle new user registration (with Zod validation)
export const registerUser = async (req, res) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message);
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    const {
      name,
      email,
      password,
      bloodGroup,
      division,
      district,
      upazila,
      area,
      phone,
    } = result.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      bloodGroup,
      division,
      district,
      upazila,
      area,
      phone,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        bloodGroup: newUser.bloodGroup,
        division: newUser.division,
        district: newUser.district,
        upazila: newUser.upazila,
        area: newUser.area,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller: log a user in
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Populate location names so the frontend can display them
    const user = await User.findOne({ email })
      .populate("division", "name")
      .populate("district", "name")
      .populate("upazila", "name");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bloodGroup: user.bloodGroup,
        division: user.division,
        district: user.district,
        upazila: user.upazila,
        area: user.area,
        districtName: user.districtName, // old value, for un-migrated users
        isAvailable: user.isAvailable,
        lastDonationDate: user.lastDonationDate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller: get all users (with optional filtering by bloodGroup & district)
export const getAllUsers = async (req, res) => {
  try {
    const { bloodGroup, district } = req.query;

    const filter = {};
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (district) filter.district = district;

    const users = await User.find(filter)
      .select("-password")
      .populate("division", "name")
      .populate("district", "name")
      .populate("upazila", "name");

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller: get a single user by their ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id)
      .select("-password")
      .populate("division", "name")
      .populate("district", "name")
      .populate("upazila", "name");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller: update a user by ID
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const {
      name,
      division,
      district,
      upazila,
      area,
      phone,
      bloodGroup,
      isAvailable,
      lastDonationDate,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        division,
        district,
        upazila,
        area,
        phone,
        bloodGroup,
        isAvailable,
        lastDonationDate,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller: change the logged-in user's password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new passwords are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    // req.user excludes the password — fetch the full user to verify it
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the current password (security gate)
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Set the new password — pre-save hook hashes it automatically
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller: delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ADMIN: get platform stats (counts)
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const availableDonors = await User.countDocuments({ isAvailable: true });
    const admins = await User.countDocuments({ role: "admin" });

    res.status(200).json({
      stats: { totalUsers, availableDonors, admins },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};