import { z } from "zod";

const variationSchema = z.object({
  id: z.coerce.string().optional(), // for editing
  // sku: z.string().min(1, "SKU is required"), // Backend generates SKU using short code, wait, user provides SKU? Backend says `generateVariations` returns SKUs, but `store` accepts `variations.*.sku`. So potentially user can edit it.
  sku: z.string().min(1, "Variation SKU is required"),
  regular_price: z.coerce.string().min(1, "Regular Price is required"),
  regular_point: z.coerce.string().min(1, "Regular Point is required"),
  sale_price: z.coerce.string().optional(),
  sale_point: z.coerce.string().optional(),
  cost_price: z.coerce.string().optional(),
  actual_quantity: z.coerce.string().min(1, "Quantity is required"),
  low_stock_threshold: z.coerce.string().optional(),
  ean_no: z.string().optional(),
  unit_weight: z.coerce.string().optional(),

  // Attributes: [{ attribute_id, attribute_item_id }]
  attributes: z.array(
    z.object({
      attribute_id: z.coerce.string(),
      attribute_item_id: z.coerce.string(),
    })
  ),

  // Images handling is complex in forms, usually array of objects or files
  images: z.any().optional(),
  delete_images: z.array(z.string()).optional(),
});

export const productSchema = z
  .object({
    name: z.string().min(1, "Product name is required"),
    merchant_id: z.coerce.string().optional(), // Often automatic
    category_id: z.coerce.string().min(1, "Category is required"),
    sub_category_id: z.coerce.string().optional(),
    brand_id: z.coerce.string().min(1, "Brand is required"),
    gender_id: z.coerce.string().optional(),
    model_id: z.coerce.string().optional(),

    sku_short_code: z.string().min(1, "SKU Short Code is required"),
    product_type: z.enum(["simple", "variable"]).default("variable"),
    status: z.enum(["active", "inactive", "draft", "out_of_stock"]).optional(),

    short_description: z.string().optional(),
    description: z.string().optional(),

    // Simple Product Fields
    sku: z.string().optional(),
    regular_price: z.coerce.string().optional(),
    regular_point: z.coerce.string().optional(),
    sale_price: z.coerce.string().optional(),
    sale_point: z.coerce.string().optional(),

    // New fields for simple product (treating it like a single variation)
    variation_regular_price: z.coerce.string().optional(),
    variation_regular_point: z.coerce.string().optional(),
    variation_sale_price: z.coerce.string().optional(),
    variation_sale_point: z.coerce.string().optional(),

    cost_price: z.coerce.string().optional(),
    unit_weight: z.coerce.string().optional(),
    actual_quantity: z.coerce.string().optional(),
    low_stock_threshold: z.coerce.string().optional(),
    ean_no: z.string().optional(),

    // Variable Product Fields
    variations: z.array(variationSchema).optional(),

    images: z.any().optional(),
    delete_images: z.any().optional(),
  })
  .superRefine((data, ctx) => {
    // For simple products, we now use variation_* fields
    if (data.product_type === "simple") {
      if (!data.variation_regular_price && !data.regular_price) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Regular Price is required",
          path: ["variation_regular_price"], // Point to new field
        });
      }
      if (!data.variation_regular_point && !data.regular_point) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Regular Point is required",
          path: ["variation_regular_point"],
        });
      }
      if (!data.actual_quantity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Actual Quantity is required",
          path: ["actual_quantity"],
        });
      }
    }

    if (data.product_type === "variable") {
      // Logic for variable product validation...
      // e.g. check if variations exist
      if (!data.variations || data.variations.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one variation is required for variable products",
          path: ["variations"],
        });
      } else {
        // Enforce attributes for each variation in variable product
        data.variations.forEach((variation, index) => {
          if (!variation.attributes || variation.attributes.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                "Attributes are required for variable product variations",
              path: ["variations", index, "attributes"],
            });
          }
        });
      }
    }
  });
