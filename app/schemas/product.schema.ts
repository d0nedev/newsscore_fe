import { z } from "zod";
import type { ProductInput } from "~/types/product";

// UX only: the Go API stays authoritative.
export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters"),
  price: z
    .number({ error: "Price is required" })
    .nonnegative("Price must be greater than or equal to 0"),
  stock: z
    .number({ error: "Stock is required" })
    .int("Stock must be an integer")
    .nonnegative("Stock cannot be negative"),
  active: z.boolean(),
}) satisfies z.ZodType<ProductInput>;
