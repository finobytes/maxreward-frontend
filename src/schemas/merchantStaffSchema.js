import { z } from "zod";

export const merchantStaffSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters long" })
    .max(100, { message: "Full name must be less than 100 characters" }),

  phone: z.string().min(1, { message: "Phone number is required" }),

  email: z
    .string()
    .email({ message: "Enter a valid email address" })
    .optional()
    .or(z.literal("")), // allow empty email if not mandatory

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(50, { message: "Password too long" }),

  gender_type: z.enum(["male", "female", "others"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),

  status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Please select a status" }),
  }),
  town: z.string().optional(),
  country_code: z.string().optional(),
});
