import { z } from "zod";

export const referNewMemberSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters long" }),
  phoneNumber: z
    .string()
    .transform((value) => value.replace(/[\s-]/g, "")) // space & dash remove
    .refine((value) => /^\d{10,11}$/.test(value), {
      message: "Invalid phone number",
    }),
  email: z
    .string()
    .email({ message: "Enter a valid email address" })
    .optional()
    .or(z.literal("")),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  address: z.string().optional().or(z.literal("")),
});
