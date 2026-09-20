import { describe, expect, it } from "vitest";
import { productSchema } from "~/schemas/product.schema";
import { safeRedirect, zodFieldErrors } from "~/utils/form";

const valid = {
  name: "Keyboard",
  description: "",
  price: 10,
  stock: 1,
  active: true,
};

describe("productSchema", () => {
  it("accepts and trims valid input", () => {
    expect(productSchema.parse({ ...valid, name: "  Keyboard  " }).name).toBe(
      "Keyboard",
    );
  });

  it("reports one message per invalid field", () => {
    const result = productSchema.safeParse({
      ...valid,
      name: " ",
      price: -1,
      stock: 1.5,
    });
    expect(result.success).toBe(false);
    expect(zodFieldErrors(result.error!)).toEqual({
      name: "Name is required",
      price: "Price must be greater than or equal to 0",
      stock: "Stock must be an integer",
    });
  });

  it("rejects empty number inputs (v-model.number yields '')", () => {
    const result = productSchema.safeParse({ ...valid, price: "" });
    expect(zodFieldErrors(result.error!).price).toBe("Price is required");
  });
});

describe("safeRedirect", () => {
  it.each([
    ["/products/1/edit", "/products/1/edit"],
    ["//evil.com", "/products"],
    ["/\\evil.com", "/products"],
    ["https://evil.com", "/products"],
    [undefined, "/products"],
    [["/a"], "/products"],
  ])("%s -> %s", (input, expected) => {
    expect(safeRedirect(input)).toBe(expected);
  });
});
