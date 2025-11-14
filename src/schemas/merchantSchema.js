import { z } from "zod";

export const merchantSchema = z.object({
  business_name: z.string().min(1, "Business name is required"),

  business_type_id: z
    .union([z.string(), z.number()])
    .refine((v) => `${v}`.trim() !== "", {
      message: "Product / Service type is required",
    }),

  address: z.string().min(3, "Company address is required"),
  state: z.string().optional(),

  annual_sales_turnover: z.string().optional(),
  reward_budget: z.string().optional(),

  phone: z
    .string()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .refine((v) => /^\d{10,11}$/.test(v), {
      message: "Invalid phone number",
    }),

  email: z.string().email().optional().or(z.literal("")),

  authorized_person_name: z
    .string()
    .min(1, "Authorized person name is required"),

  designation: z.string().optional(),

  merchant_password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  status: z.string().min(1, "Status is required"),
});
