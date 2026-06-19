import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware: verify the JWT and attach the user to the request
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check for the token in the Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]; // grab the part after "Bearer "
    }

    // 2. No token? Block the request.
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // 3. Verify the token's signature with our secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find the user from the token's payload (id), attach to request
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = user; // now any protected controller knows who's asking
    next(); // all good — proceed to the route
  } catch (error) {
    // jwt.verify throws if the token is invalid or expired
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Middleware: allow only admins (used AFTER protect)
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied, admins only" });
  }
};