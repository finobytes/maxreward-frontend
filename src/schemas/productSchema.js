import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category_id: z.coerce.string().min(1, "Category is required"),
  sub_category_id: z.coerce.string().optional(),
  brand_id: z.coerce.string().min(1, "Brand is required"),
  price: z.coerce.string().min(1, "Price is required"), // Changed to string to handle input "0.00" better before parsing, or keep number
  quantity: z.coerce.string().min(1, "Quantity is required"),
  description: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  // Images can be complex, skipping strict zod validation for the file objects for now
  // or we can validate they are array of something
  images: z.any().optional(),
  variations: z.any().optional(),
});
