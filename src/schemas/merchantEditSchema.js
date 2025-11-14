import { z } from "zod";

const optionalText = z.string().optional().or(z.literal(""));
const optionalPassword = z
  .union([
    z.literal(""),
    z.string().min(6, "Password must be at least 6 characters"),
  ])
  .optional();

export const merchantEditSchema = z.object({
  business_name: z.string().min(1, "Business name is required"),
  company_address: z.string().min(3, "Company address is required"),
  state: optionalText,
  business_type: z.string().min(1, "Business type is required"),
  annual_sales_turnover: optionalText,
  reward_budget: optionalText,
  authorized_person_name: z
    .string()
    .min(1, "Authorized person name is required"),
  phone: z
    .string()
    .transform((value) => value.replace(/[\s-]/g, ""))
    .refine((value) => /^\d{10,11}$/.test(value), {
      message: "Invalid phone number",
    }),
  email: z
    .union([z.literal(""), z.string().email("Invalid email address")])
    .optional(),
  designation: optionalText,
  merchant_password: optionalPassword,
});
