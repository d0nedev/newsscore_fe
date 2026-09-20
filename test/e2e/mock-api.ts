import type { Page, Route } from "@playwright/test";
import type { Product } from "../../app/types/product";

export interface MockState {
  loggedIn: boolean;
  products: Product[];
  // Next responses to force for "METHOD /path" keys, e.g. "GET /api/products".
  failures: Record<string, { status: number; body: unknown }[]>;
  requests: string[];
}

export function makeProduct(i: number): Product {
  return {
    id: `p${i}`,
    name: `Product ${i}`,
    description: "",
    price: i,
    stock: i,
    active: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  };
}

const json = (route: Route, status: number, body?: unknown) =>
  route.fulfill({
    status,
    contentType: "application/json",
    body: body === undefined ? "" : JSON.stringify(body),
  });

const err = (code: string, message: string, details: unknown = null) => ({
  error: { code, message, details },
});

// In-memory fake of the Go API contract (see docs/README.md, Step 3).
export async function mockApi(page: Page, init: Partial<MockState> = {}) {
  const state: MockState = {
    loggedIn: true,
    products: [],
    failures: {},
    requests: [],
    ...init,
  };

  await page.route("**/api/**", async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const key = `${req.method()} ${url.pathname}`;
    state.requests.push(`${key}${url.search}`);

    const forced = state.failures[key]?.shift();
    if (forced) return json(route, forced.status, forced.body);

    if (key === "POST /api/auth/login") {
      state.loggedIn = true;
      return json(route, 200, {
        data: { id: "u1", email: "admin@example.com", name: "Admin" },
      });
    }
    if (key === "POST /api/auth/logout") {
      state.loggedIn = false;
      return json(route, 204);
    }
    if (!state.loggedIn)
      return json(route, 401, err("UNAUTHORIZED", "Unauthorized"));
    if (key === "GET /api/auth/me") {
      return json(route, 200, {
        data: { id: "u1", email: "admin@example.com", name: "Admin" },
      });
    }

    if (key === "GET /api/products") {
      const limit = Number(url.searchParams.get("limit"));
      const start = Number(url.searchParams.get("cursor") ?? 0);
      const data = state.products.slice(start, start + limit);
      const next =
        start + limit < state.products.length ? String(start + limit) : null;
      return json(route, 200, { data, meta: { nextCursor: next } });
    }
    if (key === "POST /api/products") {
      const product = {
        ...makeProduct(state.products.length + 100),
        ...req.postDataJSON(),
      };
      state.products.unshift(product);
      return json(route, 201, { data: product });
    }

    const id = url.pathname.match(/^\/api\/products\/([^/]+)$/)?.[1];
    const index = state.products.findIndex((p) => p.id === id);
    if (id && index === -1)
      return json(route, 404, err("PRODUCT_NOT_FOUND", "Product not found"));
    if (id && req.method() === "GET")
      return json(route, 200, { data: state.products[index] });
    if (id && req.method() === "PUT") {
      state.products[index] = {
        ...state.products[index]!,
        ...req.postDataJSON(),
        updatedAt: new Date().toISOString(),
      };
      return json(route, 200, { data: state.products[index] });
    }
    if (id && req.method() === "DELETE") {
      state.products.splice(index, 1);
      return json(route, 204);
    }

    return json(route, 404, err("NOT_FOUND", "Not found"));
  });

  return state;
}
