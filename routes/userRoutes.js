import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);

// Protected routes — require a valid token
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

export default router;