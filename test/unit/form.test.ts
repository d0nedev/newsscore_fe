import { describe, expect, it } from "vitest";
import { z } from "zod";
import { safeRedirect, zodFieldErrors } from "~/utils/form";

describe("zodFieldErrors", () => {
  const schema = z.object({
    name: z.string().min(1, "Nama wajib diisi"),
    age: z.number().int("Usia harus bilangan bulat"),
  });

  it("keeps the first message per top-level field", () => {
    const result = schema.safeParse({ name: "", age: 1.5 });
    expect(zodFieldErrors(result.error!)).toEqual({
      name: "Nama wajib diisi",
      age: "Usia harus bilangan bulat",
    });
  });
});

describe("safeRedirect", () => {
  it.each([
    ["/pertandingan/bre-che", "/pertandingan/bre-che"],
    ["//evil.com", "/"],
    ["/\\evil.com", "/"],
    ["https://evil.com", "/"],
    [undefined, "/"],
    [["/a"], "/"],
  ])("%s -> %s", (input, expected) => {
    expect(safeRedirect(input)).toBe(expected);
  });
});
