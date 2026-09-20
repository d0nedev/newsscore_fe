import { expect, test } from "@playwright/test";
import { makeProduct, mockApi } from "./mock-api";

test("login redirects back, logout returns to login", async ({ page }) => {
  await mockApi(page, { loggedIn: false });

  await page.goto("/products/new");
  await expect(page).toHaveURL(/\/login\?redirect=/);

  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Enter a valid email")).toBeVisible();

  await page.getByLabel("Email").fill("admin@example.com");
  await page.getByLabel("Password").fill("secret");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL("/products/new");

  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page).toHaveURL("/login");
  await page.goto("/products");
  await expect(page).toHaveURL(/\/login/);
});

test("wrong credentials show a clear message", async ({ page }) => {
  const api = await mockApi(page, { loggedIn: false });
  api.failures["POST /api/auth/login"] = [
    {
      status: 401,
      body: {
        error: { code: "INVALID_CREDENTIALS", message: "x", details: null },
      },
    },
  ];

  await page.goto("/login");
  await page.getByLabel("Email").fill("admin@example.com");
  await page.getByLabel("Password").fill("wrong");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("alert")).toHaveText(
    "Invalid email or password.",
  );
});

test("cursor pagination loads until the end", async ({ page }) => {
  const api = await mockApi(page, {
    products: Array.from({ length: 25 }, (_, i) => makeProduct(i + 1)),
  });

  await page.goto("/products");
  await expect(page.getByRole("listitem")).toHaveCount(20);
  await page.getByRole("button", { name: "Load more" }).click();
  await expect(page.getByRole("listitem")).toHaveCount(25);
  await expect(page.getByText("End of list")).toBeVisible();
  expect(api.requests).toContain("GET /api/products?limit=20&cursor=20");
});

test("empty list and error with retry", async ({ page }) => {
  const api = await mockApi(page);
  api.failures["GET /api/products"] = [
    {
      status: 500,
      body: {
        error: { code: "INTERNAL", message: "sql: boom", details: null },
      },
    },
    {
      status: 500,
      body: {
        error: { code: "INTERNAL", message: "sql: boom", details: null },
      },
    },
    {
      status: 500,
      body: {
        error: { code: "INTERNAL", message: "sql: boom", details: null },
      },
    },
  ];

  await page.goto("/products");
  await expect(page.getByRole("alert")).toContainText(
    "Something went wrong on our side",
  );
  await expect(page.getByText("sql: boom")).toHaveCount(0);
  await page.getByRole("button", { name: "Retry" }).click();
  await expect(page.getByText("No products found.")).toBeVisible();
});

test("create product with client and server validation", async ({ page }) => {
  const api = await mockApi(page);
  api.failures["POST /api/products"] = [
    {
      status: 422,
      body: {
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed",
          details: { name: "Name already exists" },
        },
      },
    },
  ];

  await page.goto("/products/new");
  await page.getByRole("button", { name: "Create product" }).click();
  await expect(page.getByText("Name is required")).toBeVisible();

  await page.getByLabel("Name").fill("Keyboard");
  await page.getByLabel("Price").fill("49.9");
  await page.getByRole("button", { name: "Create product" }).click();
  await expect(page.getByText("Name already exists")).toBeVisible();

  await page.getByRole("button", { name: "Create product" }).click();
  await expect(page).toHaveURL("/products");
  await expect(page.getByText("Keyboard")).toBeVisible();
  expect(api.requests.filter((r) => r === "POST /api/products")).toHaveLength(
    2,
  );
});

test("edit product", async ({ page }) => {
  await mockApi(page, { products: [makeProduct(1)] });

  await page.goto("/products");
  await page.getByRole("link", { name: "Edit" }).click();
  await expect(page.getByLabel("Name")).toHaveValue("Product 1");
  await page.getByLabel("Name").fill("Renamed");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page).toHaveURL("/products");
  await expect(page.getByText("Renamed")).toBeVisible();
});

test("edit missing product shows not found", async ({ page }) => {
  await mockApi(page);
  await page.goto("/products/nope/edit");
  await expect(page.getByRole("alert")).toContainText("Product not found");
});

test("delete product, and forbidden delete shows message", async ({ page }) => {
  const api = await mockApi(page, {
    products: [makeProduct(1), makeProduct(2)],
  });
  api.failures["DELETE /api/products/p1"] = [
    {
      status: 403,
      body: {
        error: {
          code: "FORBIDDEN",
          message: "You cannot delete products",
          details: null,
        },
      },
    },
  ];
  page.on("dialog", (dialog) => dialog.accept());

  await page.goto("/products");
  const first = page.getByRole("listitem").filter({ hasText: "Product 1" });
  await first.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByRole("alert")).toHaveText(
    "You cannot delete products",
  );

  await first.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText("Product 1")).toHaveCount(0);
  await expect(page.getByText("Product 2")).toBeVisible();
});

test("expired session redirects to login", async ({ page }) => {
  const api = await mockApi(page, { products: [makeProduct(1)] });
  await page.goto("/products");
  await expect(page.getByText("Product 1")).toBeVisible();

  api.loggedIn = false;
  await page.getByRole("link", { name: "Edit" }).click();
  await expect(page).toHaveURL("/login?redirect=/products/p1/edit");
});
