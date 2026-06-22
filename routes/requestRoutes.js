import express from "express";
import {
  createRequest,
  getAllRequests,
  getMyRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
} from "../controllers/requestController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public — anyone can browse requests
router.get("/", getAllRequests);

// Protected — the logged-in user's own requests
// ⚠️ MUST come before "/:id" or "mine" would be treated as an :id
router.get("/mine", protect, getMyRequests);

// Public — single request by ID
router.get("/:id", getRequestById);

// Protected — must be logged in to create, edit, or delete
router.post("/", protect, createRequest);
router.put("/:id", protect, updateRequest);
router.delete("/:id", protect, deleteRequest);

export default router;