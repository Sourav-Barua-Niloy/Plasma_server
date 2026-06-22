import Division from "../models/Division.js";
import District from "../models/District.js";
import Upazila from "../models/Upazila.js";
import mongoose from "mongoose";

// GET all divisions (sorted A–Z)
export const getDivisions = async (req, res) => {
  try {
    const divisions = await Division.find().sort({ name: 1 });
    res.status(200).json({ divisions });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET districts — optionally filtered by ?division=ID
export const getDistricts = async (req, res) => {
  try {
    const { division } = req.query;

    const filter = {};
    if (division) {
      if (!mongoose.Types.ObjectId.isValid(division)) {
        return res.status(400).json({ message: "Invalid division ID" });
      }
      filter.division = division;
    }

    const districts = await District.find(filter).sort({ name: 1 });
    res.status(200).json({ districts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET upazilas — optionally filtered by ?district=ID
export const getUpazilas = async (req, res) => {
  try {
    const { district } = req.query;

    const filter = {};
    if (district) {
      if (!mongoose.Types.ObjectId.isValid(district)) {
        return res.status(400).json({ message: "Invalid district ID" });
      }
      filter.district = district;
    }

    const upazilas = await Upazila.find(filter).sort({ name: 1 });
    res.status(200).json({ upazilas });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------- ADMIN: Divisions ----------
export const createDivision = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const division = await Division.create({ name: name.trim() });
    res.status(201).json({ message: "Division created", division });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateDivision = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });

    const division = await Division.findByIdAndUpdate(
      id,
      { name: req.body.name?.trim() },
      { new: true, runValidators: true }
    );
    if (!division) return res.status(404).json({ message: "Division not found" });

    res.status(200).json({ message: "Division updated", division });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteDivision = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });

    const deleted = await Division.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Division not found" });

    // Cascade: delete districts (and their upazilas) under this division
    const districts = await District.find({ division: id });
    const districtIds = districts.map((d) => d._id);
    await Upazila.deleteMany({ district: { $in: districtIds } });
    await District.deleteMany({ division: id });

    res.status(200).json({ message: "Division and its children deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------- ADMIN: Districts ----------
export const createDistrict = async (req, res) => {
  try {
    const { name, division } = req.body;
    if (!name || !division)
      return res.status(400).json({ message: "Name and division are required" });
    if (!mongoose.Types.ObjectId.isValid(division))
      return res.status(400).json({ message: "Invalid division ID" });

    const district = await District.create({ name: name.trim(), division });
    res.status(201).json({ message: "District created", district });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateDistrict = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });

    const { name, division } = req.body;
    const update = {};
    if (name) update.name = name.trim();
    if (division) update.division = division;

    const district = await District.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!district) return res.status(404).json({ message: "District not found" });

    res.status(200).json({ message: "District updated", district });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteDistrict = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });

    const deleted = await District.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "District not found" });

    // Cascade: delete upazilas under this district
    await Upazila.deleteMany({ district: id });

    res.status(200).json({ message: "District and its upazilas deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------- ADMIN: Upazilas ----------
export const createUpazila = async (req, res) => {
  try {
    const { name, district } = req.body;
    if (!name || !district)
      return res.status(400).json({ message: "Name and district are required" });
    if (!mongoose.Types.ObjectId.isValid(district))
      return res.status(400).json({ message: "Invalid district ID" });

    const upazila = await Upazila.create({ name: name.trim(), district });
    res.status(201).json({ message: "Upazila created", upazila });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateUpazila = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });

    const { name, district } = req.body;
    const update = {};
    if (name) update.name = name.trim();
    if (district) update.district = district;

    const upazila = await Upazila.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!upazila) return res.status(404).json({ message: "Upazila not found" });

    res.status(200).json({ message: "Upazila updated", upazila });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteUpazila = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });

    const deleted = await Upazila.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Upazila not found" });

    res.status(200).json({ message: "Upazila deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};