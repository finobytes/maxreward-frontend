import { z } from "zod";

export const updateMemberSchema = z.object({
  fullName: z
    .string({ required_error: "Full Name is required" })
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name must not exceed 100 characters"),

  phoneNumber: z
    .string()
    .regex(
      /^(?:\+?8801[3-9]\d{8}|01[3-9]\d{8}|\+?601[0-46-9]\d{7,8}|601[0-46-9]\d{7,8})$/,
      "Phone number must be Bangladeshi or Malaysian"
    ),

  email: z
    .union([z.string().email("Invalid email address"), z.literal("")])
    .optional(),

  referralCode: z
    .string({ required_error: "Referral Code is required" })
    .nonempty("Referral Code is required"),
});
