import express from "express";
import {
  registerUser,
  getAllUsers,
  getUserById,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/", getAllUsers);       // GET /api/users
router.get("/:id", getUserById);    // GET /api/users/:id

export default router;