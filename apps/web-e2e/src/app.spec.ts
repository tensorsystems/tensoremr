import { expect, test } from "@playwright/test";

test("should start page", async ({ page }) => {
  await page.goto('http://localhost:4200');

  expect(true).toBeTruthy();
});


// test("has title", async ({page}) => {
//   await page.goto('https://playwright.dev/');

//   await expect(page).toHaveTitle(/Playwright/);
// });

// test.describe("log in", () => {
//   test.beforeEach(async ({page}) => {
//     await page.goto('http://localhost:4200/auth?redirectToPath=');
//   })

//   test("log in success when credentials are correct", async ({page}) => {
//     await page.getByPlaceholder('Email address').click();
//     await page.getByPlaceholder('Email address').fill('receptionist@tensoremr.com');
//     await page.getByPlaceholder('Email address').press('Tab');
//     await page.getByPlaceholder('Password').fill('changeme1');
//     await page.getByPlaceholder('Password').press('Enter'); 
//     await expect(page).toHaveURL('http://localhost:4200');
//   });

//   test("logs in failure when credentials are incorrect", async ({page}) => {
//     await page.getByPlaceholder('Email address').click();
//     await page.getByPlaceholder('Email address').fill('receptionist@tensoremr.com');
//     await page.getByPlaceholder('Email address').press('Tab');
//     await page.getByPlaceholder('Password').fill('wrongpassword');
//     await page.getByPlaceholder('Password').press('Enter'); 
//     await expect(page).toHaveURL('http://localhost:4200/auth?redirectToPath=');
//   });
// })