import { expect, test } from "@playwright/test";

test("should start page", async ({ page }) => {
  await page.goto('https://playwright.dev/');

  expect(true).toBeTruthy();
});
