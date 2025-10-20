import { z } from "zod";

export const updateMemberSchema = z.object({
  fullName: z
    .string({ required_error: "Full Name is required" })
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name must not exceed 100 characters"),

  phoneNumber: z
    .string({ required_error: "Phone Number is required" })
    .regex(/^[0-9]{10,15}$/, "Phone number must be 10–15 digits"),

  email: z
    .union([z.string().email("Invalid email address"), z.literal("")])
    .optional(),

  referralCode: z
    .string({ required_error: "Referral Code is required" })
    .nonempty("Referral Code is required"),
});
