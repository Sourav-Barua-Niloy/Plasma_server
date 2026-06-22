import express from "express";
import {
  getAllUsers,
  deleteUser,
  adminUpdateUser,
  getAdminStats,
} from "../controllers/userController.js";
import {
  getAllRequests,
  adminDeleteRequest,
} from "../controllers/requestController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Every route requires: logged in (protect) AND admin (adminOnly)
router.use(protect, adminOnly);

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.put("/users/:id", adminUpdateUser);
router.delete("/users/:id", deleteUser);
router.get("/requests", getAllRequests);
router.delete("/requests/:id", adminDeleteRequest);

export default router;