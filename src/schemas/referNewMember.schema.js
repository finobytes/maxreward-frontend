import { z } from "zod";

export const referNewMemberSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters long" }),

  country_id: z.string().min(1, { message: "Citizenship is required" }),

  phone: z
    .string()
    .min(5, { message: "Enter a valid phone number" })
    .refine((value) => /^\d+$/.test(value), {
      message: "Phone must be numeric",
    }),

  country_code: z.string().min(1, { message: "Country code is required" }),

  email: z.string().email().optional().or(z.literal("")),
});
