import { expect, test } from "@playwright/test";

test("hydration calculator computes hydration from flour and water", async ({ page }) => {
  await page.goto("/hydration");
  await page.getByLabel("Flour weight in grams").fill("500");
  await page.getByLabel("Water weight in grams").fill("400");
  await expect(page.getByTestId("hydration-result")).toContainText("80%");
});

test("hydration calculator computes water for a target hydration", async ({ page }) => {
  await page.goto("/hydration");
  await page.getByLabel("Flour weight for target hydration").fill("400");
  await page.getByLabel("Target hydration percent").fill("75");
  await expect(page.getByTestId("target-result")).toContainText("300");
});

test("recipe scaler computes a full recipe breakdown", async ({ page }) => {
  await page.goto("/recipe-scaler");
  await page.getByLabel("Amount in grams").fill("1000");
  await page.getByLabel("Hydration percent", { exact: true }).fill("75");
  await page.getByLabel("Salt percent").fill("2");
  await page.getByLabel("Starter percent, of total flour").fill("20");
  await page.getByLabel("Starter hydration percent").fill("100");

  const result = page.getByTestId("result");
  await expect(result).toContainText("900 g"); // flour to add
  await expect(result).toContainText("1770 g"); // total dough weight
});

test("starter feeding calculator computes flour and water to add", async ({ page }) => {
  await page.goto("/starter-feeding");
  await page.getByLabel("Starter amount in grams").fill("20");
  await page.getByLabel("Starter ratio part").fill("1");
  await page.getByLabel("Flour ratio part").fill("5");
  await page.getByLabel("Water ratio part").fill("5");

  const result = page.getByTestId("result");
  await expect(result).toContainText("100 g");
});

test("homepage links reach every tool", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Recipe scaler" }).click();
  await expect(page).toHaveURL(/\/recipe-scaler$/);
});
