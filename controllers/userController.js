import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { registerSchema } from "../validators/userValidator.js";

// Controller: handle new user registration (with Zod validation)
export const registerUser = async (req, res) => {
  try {
    // 1. Validate incoming data against our Zod schema
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      // Validation failed — collect all the error messages
      const errors = result.error.issues.map((issue) => issue.message);
      return res.status(400).json({
        message: "Validation failed",
        errors, // an array of human-readable messages
      });
    }

    // 2. Use the validated, cleaned data (trimmed, correct types)
    const { name, email, password, bloodGroup, district, phone } = result.data;

    // 3. Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // 4. Create and save the new user to MongoDB
    //    (the password is hashed automatically by the pre-save hook in the model)
    const newUser = await User.create({
      name,
      email,
      password,
      bloodGroup,
      district,
      phone,
    });

    // 5. Send back a success response (without the password)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        bloodGroup: newUser.bloodGroup,
        district: newUser.district,
      },
    });
  } catch (error) {
    // If anything goes wrong, send a server error
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller: log a user in
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic check
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // 2. Find the user by email (password is included by default)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Compare the given password with the stored hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4. Create a JWT token containing the user's id and role
    const token = jwt.sign(
      { id: user._id, role: user.role }, // payload
      process.env.JWT_SECRET, // secret key
      { expiresIn: "7d" } // token valid for 7 days
    );

    // 5. Send back the token and basic user info (NEVER the password)
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bloodGroup: user.bloodGroup,
        district: user.district,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller: get all users (with optional filtering by bloodGroup & district)
export const getAllUsers = async (req, res) => {
  try {
    // Read optional filters from the query string (?bloodGroup=O+&district=Dhaka)
    const { bloodGroup, district } = req.query;

    // Build a filter object — only add fields that were actually provided
    const filter = {};
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (district) filter.district = district;

    // Find users matching the filter; exclude the password field for security
    const users = await User.find(filter).select("-password");

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
    const { id } = req.params; // grab the :id from the URL

    const user = await User.findById(id).select("-password");

    // If no user with that ID exists, say so
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

    // Fields we ALLOW to be updated (we don't let just anything change)
    const { name, district, phone, bloodGroup, isAvailable } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, district, phone, bloodGroup, isAvailable },
      {
        new: true,           // return the UPDATED document, not the old one
        runValidators: true, // re-check schema rules (e.g. valid bloodGroup)
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

// Controller: delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};