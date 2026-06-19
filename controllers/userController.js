import User from "../models/User.js";

// Controller: handle new user registration
export const registerUser = async (req, res) => {
  try {
    // 1. Get the data the frontend sent (from the request body)
    const { name, email, password, bloodGroup, district, phone } = req.body;

    // 2. Basic check: are the required fields present?
    if (!name || !email || !password || !bloodGroup || !district || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 3. Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // 4. Create and save the new user to MongoDB
    const newUser = await User.create({
      name,
      email,
      password, // NOTE: plain text for now — we'll hash it in the auth phase!
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