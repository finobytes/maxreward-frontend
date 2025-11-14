import { z } from "zod";

export const merchantSchema = z.object({
  business_name: z.string().min(1, "Business name is required"),
  business_type: z.string().min(1, "Business type is required"),
  address: z.string().min(3, "Company address is required"),
  state: z.string().optional(),
  annual_sales_turnover: z.string().optional(),
  reward_budget: z.string().optional(),
  phoneNumber: z
    .string()
    .transform((value) => value.replace(/[\s-]/g, "")) // space & dash remove
    .refine((value) => /^\d{10,11}$/.test(value), {
      message: "Invalid phone number",
    }),
  email: z.string().email("Invalid email address").optional().or(z.literal("")), // allow empty email if optional
  authorized_person_name: z
    .string()
    .min(1, "Authorized person name is required"),
  status: z.string().min(1, "Status is required"),
});
