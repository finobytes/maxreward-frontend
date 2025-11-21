import { z } from "zod";

export const referNewMemberSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters long" }),

  countryCode: z
    .string()
    .min(1, { message: "Country code is required" })
    .regex(/^\+?\d+$/, { message: "Invalid country code" }),

  phoneNumber: z
    .string()
    .transform((value) => value.replace(/[\s-]/g, "")) // remove spaces/dashes
    .refine((value) => /^\d+$/.test(value), {
      message: "Phone number must contain digits only",
    }),

  nationality: z.string().min(2, { message: "Nationality is required" }),

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
