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