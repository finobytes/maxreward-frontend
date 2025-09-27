import { z } from "zod";

export const memberSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name must not exceed 100 characters"),

  phoneNumber: z
    .string()
    .regex(/^[0-9]{10,15}$/, "Phone number must be 10–15 digits"),

  gender: z
    .enum(["male", "female", "other"], {
      errorMap: () => ({ message: "Gender is required" }),
    })
    .optional(),

  address: z.string().optional(),

  city: z.string().optional(),

  email: z.email("Invalid email address").optional().or(z.literal("")),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),

  referralCode: z.string().nonempty("Referral Code is required"),
});
