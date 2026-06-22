import express from "express";
import {
  getDivisions,
  getDistricts,
  getUpazilas,
  createDivision,
  updateDivision,
  deleteDivision,
  createDistrict,
  updateDistrict,
  deleteDistrict,
  createUpazila,
  updateUpazila,
  deleteUpazila,
} from "../controllers/locationController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public reads
router.get("/divisions", getDivisions);
router.get("/districts", getDistricts);
router.get("/upazilas", getUpazilas);

// Admin-only writes
router.post("/divisions", protect, adminOnly, createDivision);
router.put("/divisions/:id", protect, adminOnly, updateDivision);
router.delete("/divisions/:id", protect, adminOnly, deleteDivision);

router.post("/districts", protect, adminOnly, createDistrict);
router.put("/districts/:id", protect, adminOnly, updateDistrict);
router.delete("/districts/:id", protect, adminOnly, deleteDistrict);

router.post("/upazilas", protect, adminOnly, createUpazila);
router.put("/upazilas/:id", protect, adminOnly, updateUpazila);
router.delete("/upazilas/:id", protect, adminOnly, deleteUpazila);

export default router;