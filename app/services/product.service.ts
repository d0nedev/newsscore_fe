import type { ApiResponse, CursorPage } from "~/types/api";
import type { Product, ProductInput } from "~/types/product";
import { apiFetch } from "./api-client";

export const productService = {
  list(params: { limit: number; cursor?: string }, signal?: AbortSignal) {
    return apiFetch<CursorPage<Product>>("/api/products", {
      query: params,
      signal,
    });
  },

  async get(id: string, signal?: AbortSignal) {
    const res = await apiFetch<ApiResponse<Product>>(
      `/api/products/${encodeURIComponent(id)}`,
      { signal },
    );
    return res.data;
  },

  async create(input: ProductInput) {
    const res = await apiFetch<ApiResponse<Product>>("/api/products", {
      method: "POST",
      body: input,
    });
    return res.data;
  },

  async update(id: string, input: ProductInput) {
    const res = await apiFetch<ApiResponse<Product>>(
      `/api/products/${encodeURIComponent(id)}`,
      { method: "PUT", body: input },
    );
    return res.data;
  },

  async remove(id: string) {
    await apiFetch<unknown>(`/api/products/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
};
