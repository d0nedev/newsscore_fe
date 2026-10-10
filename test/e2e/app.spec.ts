import type { Page } from "@playwright/test";
import { expect, test } from "./mock-api";

const matchList = (page: Page) =>
  page.getByRole("list", { name: "Pertandingan hari ini" });

test("home lists matches and filters by status", async ({ page }) => {
  await page.goto("/");
  await expect(
    matchList(page).getByRole("link", { name: /Liverpool/ }),
  ).toBeVisible();

  await page.getByRole("button", { name: "LIVE", exact: true }).click();
  await expect(
    matchList(page).getByRole("link", { name: /Liverpool/ }),
  ).toHaveCount(0);
  await expect(
    matchList(page).getByRole("link", { name: /Brentford/ }),
  ).toBeVisible();
});

test("date bar switches days", async ({ page }) => {
  await page.goto("/");
  const dateBar = page.getByRole("navigation", {
    name: "Tanggal pertandingan",
  });
  await expect(
    matchList(page).getByRole("link", { name: /Brentford/ }),
  ).toBeVisible();

  await dateBar.getByRole("button", { name: "Sen 21.09" }).click();
  await expect(
    matchList(page).getByRole("link", { name: /Girona/ }),
  ).toBeVisible();
  await expect(page.getByText("2 pertandingan")).toBeVisible();

  await dateBar.getByRole("button", { name: "Tanggal sebelumnya" }).click();
  await expect(page.getByRole("button", { name: "Hari ini" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("match detail switches between tabs", async ({ page }) => {
  await page.goto("/");
  await matchList(page)
    .getByRole("link", { name: /Brentford/ })
    .click();
  await expect(page).toHaveURL("/pertandingan/bre-che");
  const scoreboard = page.getByRole("region", { name: "Papan skor" });
  await expect(scoreboard.getByText("1 - 2")).toBeVisible();
  await expect(page.getByText("C. Palmer").first()).toBeVisible();

  await page.getByRole("tab", { name: "Statistik", exact: true }).click();
  await expect(page.getByText("Penguasaan bola")).toBeVisible();

  await page.getByRole("tab", { name: "Susunan Pemain" }).click();
  await expect(page.getByRole("link", { name: "M. Flekken" })).toBeVisible();

  // The API has no head-to-head, odds, commentary or player ratings.
  await expect(page.getByRole("tab", { name: "H2H" })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: "Peluang" })).toHaveCount(0);
});

test("league page shows standings", async ({ page }) => {
  await page.goto("/sepak-bola/liga-primer");
  await expect(
    page.getByRole("heading", { name: "Liga Primer", exact: true }),
  ).toBeVisible();

  await page.getByRole("tab", { name: "Klasemen" }).click();
  const table = page.getByRole("table");
  await expect(table.getByRole("link", { name: "Arsenal" })).toBeVisible();
  await expect(table.getByRole("row")).toHaveCount(7); // header + 6 teams
});

test("team squad links through to a player profile", async ({ page }) => {
  await page.goto("/tim/chelsea");
  await page.getByRole("tab", { name: "Skuad" }).click();
  await page.getByRole("link", { name: /C. Palmer/ }).click();
  await expect(page).toHaveURL("/pemain/che-6");
  await expect(
    page.getByRole("heading", { name: "C. Palmer", exact: true }),
  ).toBeVisible();
});

test("mobile menu opens the sidebar and closes on navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menu" }).click();
  const drawer = page.getByRole("dialog", { name: "Menu" });
  await drawer
    .getByRole("navigation", { name: "Kompetisi" })
    .getByRole("link", { name: "Liga Primer" })
    .click();
  await expect(page).toHaveURL("/sepak-bola/liga-primer");
  await expect(drawer).toHaveCount(0);
});

test("a starred match stays starred after navigating away", async ({
  page,
}) => {
  await page.goto("/");
  const star = matchList(page).getByRole("button", { name: /Liverpool/ });
  await star.click();
  await expect(star).toHaveAttribute("aria-pressed", "true");

  await page.goto("/sepak-bola/liga-primer");
  await page.goto("/");
  await expect(star).toHaveAttribute("aria-pressed", "true");
});

test("skip link is the first tab stop and jumps to the content", async ({
  page,
}) => {
  await page.goto("/");
  const skip = page.getByRole("link", { name: "Lewati ke konten" });
  await expect(skip).toBeAttached(); // client-rendered: wait for mount
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#konten")).toBeFocused();
});

test("header search finds a team and a player", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Cari tim atau pemain" }).click();
  await page
    .getByRole("searchbox", { name: "Cari tim atau pemain" })
    .fill("pal");
  await page.getByRole("link", { name: /C\. Palmer/ }).click();
  await expect(page).toHaveURL(/\/pemain\//);
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("league top players tab lists scorers", async ({ page }) => {
  await page.goto("/sepak-bola/liga-primer");
  await page.getByRole("tab", { name: "Pemain Terbaik" }).click();
  await expect(page.getByRole("heading", { name: "Top skor" })).toBeVisible();
  await page.locator("ol li a").first().click();
  await expect(page).toHaveURL(/\/pemain\//);
});

test("unknown match shows not found", async ({ page }) => {
  await page.goto("/pertandingan/nope");
  await expect(page.getByText("Pertandingan tidak ditemukan.")).toBeVisible();
});
