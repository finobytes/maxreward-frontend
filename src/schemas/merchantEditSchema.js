import { z } from "zod";

const optionalText = z.union([z.string(), z.number()]).nullable().optional();

export const merchantEditSchema = z.object({
  business_name: z.string().min(1, "Business name is required"),
  address: z.string().min(3, "Company address is required"),
  state: optionalText,
  business_type: z.string().min(1, "Business type is required"),
  annual_sales_turnover: optionalText,
  reward_budget: optionalText,
  authorized_person_name: z
    .string()
    .min(1, "Authorized person name is required"),
  phone: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => value.length >= 10 && value.length <= 15, {
      message: "Phone number must be between 10 and 15 digits",
    }),
  email: z
    .union([z.literal(""), z.string().email("Invalid email address")])
    .nullable()
    .optional(),
  designation: optionalText,
  town: optionalText,
  country_code: optionalText,
});
