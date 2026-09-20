import type { ApiResponse } from "~/types/api";
import type { LoginInput, User } from "~/types/auth";
import { apiFetch } from "./api-client";

// ASSUMED contract (confirm with the Go API, see README "Authentication"):
// cookie session, POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me.
export const authService = {
  async login(input: LoginInput) {
    const res = await apiFetch<ApiResponse<User>>("/api/auth/login", {
      method: "POST",
      body: input,
    });
    return res.data;
  },

  async logout() {
    await apiFetch<unknown>("/api/auth/logout", { method: "POST" });
  },

  // null = not signed in.
  async me(signal?: AbortSignal) {
    try {
      const res = await apiFetch<ApiResponse<User>>("/api/auth/me", { signal });
      return res.data;
    } catch (error) {
      if (error instanceof ApiError && error.kind === "unauthorized") {
        return null;
      }
      throw error;
    }
  },
};
