import { z } from "zod";

export const merchantStaffUpdateSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters long" })
    .max(100, { message: "Full name must be less than 100 characters" }),

  phone: z
    .string()
    .regex(/^(\+?\d{10,15})$/, { message: "Enter a valid phone number" }),

  email: z
    .string()
    .email({ message: "Enter a valid email address" })
    .optional()
    .or(z.literal("")),

  // 🟡 optional password for update
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(50, { message: "Password too long" })
    .optional()
    .or(z.literal("")),

  gender_type: z.enum(["male", "female", "others"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),

  status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Please select a status" }),
  }),
});
