import { z } from "zod";

export const referNewMemberSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters long" }),
  phoneNumber: z
    .string()
    .regex(/^01[3-9]\d{8}$/, {
      message: "Enter a valid Bangladeshi phone number",
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
