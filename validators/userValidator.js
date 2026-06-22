import { z } from "zod";

// Valid blood groups (must match your Mongoose model)
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// The schema: every rule for a valid registration
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be under 50 characters"),

  email: z.email("Please enter a valid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),

  bloodGroup: z.enum(bloodGroups, {
    error: "Please select a valid blood group",
  }),

  // Reference-based location — each must be a valid MongoDB ObjectId (24 hex chars)
  division: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Please select a valid division"),
  district: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Please select a valid district"),
  upazila: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Please select a valid upazila"),

  // Free-text area detail — optional
  area: z.string().trim().max(150, "Area is too long").optional(),

  phone: z
    .string()
    .trim()
    .regex(
      /^01[3-9]\d{8}$/,
      "Phone must be a valid Bangladeshi number (e.g. 01712345678)"
    ),
});