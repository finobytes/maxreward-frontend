import { z } from "zod";

export const memberSchema = z.object({
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
  gender: z
    .union([z.enum(["male", "female", "other"]), z.literal("")])
    .optional(),

  address: z.string().optional(),
  city: z.string().optional(),

  email: z
    .union([z.string().email("Invalid email address"), z.literal("")])
    .optional(),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),

  businessType: z
    .string({ required_error: "Business Type is required" })
    .nonempty("Business Type is required"),

  referralCode: z
    .string({ required_error: "Referral Code is required" })
    .nonempty("Referral Code is required"),
});
