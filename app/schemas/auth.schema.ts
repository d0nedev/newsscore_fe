import { z } from "zod";
import type { LoginInput } from "~/types/auth";

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
}) satisfies z.ZodType<LoginInput>;
