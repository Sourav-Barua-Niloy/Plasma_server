import { z } from "zod";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const requestSchema = z.object({
  patientName: z
    .string()
    .trim()
    .min(2, "Patient name must be at least 2 characters")
    .max(50, "Patient name is too long"),

  bloodGroup: z.enum(bloodGroups, {
    error: "Please select a valid blood group",
  }),

  unitsNeeded: z
    .number()
    .int("Units must be a whole number")
    .min(1, "At least 1 unit is required")
    .max(10, "Maximum 10 units"),

  hospital: z.string().trim().min(2, "Hospital name is required"),

  // Reference-based location — each must be a valid ObjectId (24 hex chars)
  division: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Please select a valid division"),
  district: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Please select a valid district"),
  upazila: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Please select a valid upazila"),

  area: z.string().trim().max(150, "Area is too long").optional(),

  contactPhone: z
    .string()
    .trim()
    .regex(/^01[3-9]\d{8}$/, "Phone must be a valid Bangladeshi number"),

  urgency: z.enum(["normal", "urgent", "critical"]).optional(),

  note: z.string().trim().max(300, "Note is too long").optional(),
});