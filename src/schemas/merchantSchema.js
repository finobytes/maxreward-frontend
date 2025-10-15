import { z } from "zod";

export const merchantSchema = z
  .object({
    business_name: z.string().min(1, "Business name is required"),
    business_type: z.string().min(1, "Business type is required"),
    business_description: z.string().min(5, "Description too short"),
    company_address: z.string().min(3, "Company address is required"),
    license_number: z.string().min(3, "License number is required"),
    status: z.string().min(1, "Status is required"),
    bank_name: z.string().min(1, "Bank name is required"),
    account_holder_name: z.string().min(1, "Account holder name required"),
    account_number: z.string().min(6, "Account number required"),
    owner_name: z.string().min(1, "Owner name required"),
    phone: z.string().min(11, "Phone must be at least 11 digits"),
    gender: z.string().min(1, "Gender required"),
    address: z.string().min(3, "Address required"),
    email: z.string().email("Invalid email address"),
    merchant_password: z.string().min(6, "Password must be 6+ characters"),
    confirm_password: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.merchant_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
