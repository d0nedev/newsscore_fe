import type { z } from "zod";

// First message per top-level field, from a failed Zod parse.
export function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    errors[key] ??= issue.message;
  }
  return errors;
}

// Only allow same-app paths, to avoid open redirects via ?redirect=.
export function safeRedirect(value: unknown, fallback = "/products"): string {
  return typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.startsWith("/\\")
    ? value
    : fallback;
}
