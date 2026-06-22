import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  deleteMyAccount,
  changePassword,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", protect, getAllUsers);

// Protected — specific routes BEFORE the dynamic /:id route
router.put("/change-password", protect, changePassword);
router.delete("/me", protect, deleteMyAccount);

// Dynamic ID routes (must come after specific paths)
router.get("/:id", getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

export default router;