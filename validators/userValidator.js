import { z } from "zod";

// Valid options (must match your Mongoose model)
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

  district: z.enum(districts, {
    error: "Please select a valid district",
  }),

  phone: z
    .string()
    .trim()
    .regex(
      /^01[3-9]\d{8}$/,
      "Phone must be a valid Bangladeshi number (e.g. 01712345678)"
    ),
});