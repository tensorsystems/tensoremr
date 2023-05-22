import { expect, test } from "@playwright/test";

test("should start page", async ({ page }) => {
  await page.goto("http://localhost:4200");
  await expect(page).toHaveURL("http://localhost:4200");
});
