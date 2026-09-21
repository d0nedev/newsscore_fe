import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

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

  await page.getByRole("tab", { name: "H2H" }).click();
  await expect(page.getByText("Pertemuan terakhir")).toBeVisible();

  await page.getByRole("tab", { name: "Komentar" }).click();
  await expect(page.getByText("Komentar langsung")).toBeVisible();

  await page.getByRole("tab", { name: "Peluang" }).click();
  await expect(page.getByRole("cell", { name: "SkorBet" })).toBeVisible();

  await page.getByRole("tab", { name: "Statistik Pemain" }).click();
  await expect(page.getByRole("cell", { name: "8.4" })).toBeVisible();
});

test("league and team odds tabs list fixtures", async ({ page }) => {
  await page.goto("/sepak-bola/liga-primer");
  await page.getByRole("tab", { name: "Peluang" }).click();
  await expect(
    page.getByRole("link", { name: "Liverpool - Newcastle" }),
  ).toBeVisible();

  await page.goto("/tim/chelsea");
  await page.getByRole("tab", { name: "Peluang" }).click();
  await expect(
    page.getByRole("link", { name: "Brentford - Chelsea" }),
  ).toBeVisible();
});

test("league archive lists past seasons", async ({ page }) => {
  await page.goto("/sepak-bola/liga-primer");
  await page.getByRole("tab", { name: "Arsip" }).click();
  await expect(page.getByText("Arsip musim")).toBeVisible();
  await expect(page.getByRole("cell", { name: "2024/2025" })).toBeVisible();
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
    page.getByRole("heading", { name: "Transfer", exact: true }),
  ).toBeVisible();

  await page.getByRole("tab", { name: "Cedera" }).click();
  await expect(
    page.getByRole("heading", { name: "Sejarah cedera", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Cedera hamstring")).toBeVisible();
});

test("unknown match shows not found", async ({ page }) => {
  await page.goto("/pertandingan/nope");
  await expect(page.getByText("Pertandingan tidak ditemukan.")).toBeVisible();
});
