import { z } from "zod";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const districts = [
  "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogura",
  "Brahmanbaria", "Chandpur", "Chattogram", "Chuadanga", "Cox's Bazar",
  "Cumilla", "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha",
  "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore", "Jhalokati",
  "Jhenaidah", "Joypurhat", "Khagrachhari", "Khulna", "Kishoreganj",
  "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur",
  "Magura", "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj",
  "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi",
  "Natore", "Netrokona", "Nilphamari", "Noakhali", "Pabna",
  "Panchagarh", "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi",
  "Rangamati", "Rangpur", "Satkhira", "Shariatpur", "Sherpur",
  "Sirajganj", "Sunamganj", "Sylhet", "Tangail", "Thakurgaon",
];

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

  hospital: z
    .string()
    .trim()
    .min(2, "Hospital name is required"),

  district: z.enum(districts, {
    error: "Please select a valid district",
  }),

  contactPhone: z
    .string()
    .trim()
    .regex(/^01[3-9]\d{8}$/, "Phone must be a valid Bangladeshi number"),

  urgency: z.enum(["normal", "urgent", "critical"]).optional(),

  note: z.string().trim().max(300, "Note is too long").optional(),
});