import { z } from "zod";

export const referNewMemberSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters long" }),
  phoneNumber: z
    .string()
    .regex(
      /^(?:\+?8801[3-9]\d{8}|01[3-9]\d{8}|\+?601[0-9]\d{7,8}|601[0-9]\d{7,8})$/,
      "Phone number must be Bangladeshi or Malaysian"
    ),
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
