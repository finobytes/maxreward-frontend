import { z } from "zod";

export const loginSchema = z.object({
  userName: z.string().min(1, "User Name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().optional(),
});
