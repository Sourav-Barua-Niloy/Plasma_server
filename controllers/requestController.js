import BloodRequest from "../models/BloodRequest.js";
import mongoose from "mongoose";
import { requestSchema } from "../validators/requestValidator.js";

// Create a new blood request
export const createRequest = async (req, res) => {
  try {
    const result = requestSchema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    // result.data now includes division/district/upazila/area
    const newRequest = await BloodRequest.create({
      ...result.data,
      requestedBy: req.user._id,
    });

    res.status(201).json({
      message: "Blood request created successfully",
      request: newRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all blood requests (with optional filtering)
export const getAllRequests = async (req, res) => {
  try {
    const { bloodGroup, district, status } = req.query;

    const filter = {};
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (district) filter.district = district; // district ID now
    if (status) filter.status = status;

    const requests = await BloodRequest.find(filter)
      .populate("requestedBy", "name email")
      .populate("division", "name")
      .populate("district", "name")
      .populate("upazila", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single request by ID
export const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid request ID" });
    }

    const request = await BloodRequest.findById(id)
      .populate("requestedBy", "name email")
      .populate("division", "name")
      .populate("district", "name")
      .populate("upazila", "name");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ request });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a request (e.g. mark as fulfilled) — only the owner can
export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid request ID" });
    }

    const request = await BloodRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.requestedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this request" });
    }

    const { status, urgency, note, unitsNeeded } = req.body;

    const updated = await BloodRequest.findByIdAndUpdate(
      id,
      { status, urgency, note, unitsNeeded },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Request updated", request: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a request — only the owner can
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid request ID" });
    }

    const request = await BloodRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.requestedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this request" });
    }

    await request.deleteOne();
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ADMIN: delete any request (moderation — bypasses ownership check)
export const adminDeleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid request ID" });
    }

    const deleted = await BloodRequest.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Request deleted by admin" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};