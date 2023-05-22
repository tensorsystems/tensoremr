import { expect, test } from "@playwright/test";

test("should start page", async ({ page }) => {
  await page.goto("http://localhost:4200");

  await page.getByRole("link", { name: "person_add New patient" }).click();

  await expect(page).toHaveURL("http://localhost:4200/patients/create");
});

test("creates new patient", async ({ page }) => {
  await page.goto("http://localhost:4200");
  await page.getByRole("link", { name: "person_add New patient" }).click();
  await expect(page).toHaveURL("http://localhost:4200/patients/create");

  await page.getByLabel("Given name").fill(generateString(5));
  await page.getByLabel("Family name").fill(generateString(5));
  await page.getByLabel("Name prefix").fill("Mr.");
  await page.locator('input[name="birthDate"]').fill("1994-01-01");
  await page.getByRole("combobox", { name: "Gender" }).selectOption("male");
  await page
    .getByRole("combobox", { name: "Martial Status" })
    .selectOption("S");
  await page.locator('input[name="telecom\\.0\\.value"]').fill("55503053");

  await page.locator('input[name="address\\.0\\.text"]').fill("Address Text");
  await page
    .locator('input[name="address\\.0\\.line.0"]')
    .fill("Address Line 1");
  await page
    .locator('input[name="address\\.0\\.line.1"]')
    .fill("Address Line 2");
  await page.locator('input[name="address\\.0\\.city"]').fill("Addis Ababa");
  await page.locator('input[name="address\\.0\\.state"]').fill("Addis Ababa");
  await page.locator('input[name="address\\.0\\.country"]').fill("Ethiopia");

  const responsePromise = page.waitForResponse("**/patients");
  await page.getByRole("button", { name: "save Save" }).click();
  const response = await responsePromise;
  const ok = response?.ok();

  expect(ok).toBeTruthy();

  if (ok) {
    const body = await response?.json();
    await expect(page).toHaveURL(`http://localhost:4200/patients/${body?.id}`);
  }
});

test("shows similar patients warning when similar patient found", async ({ page }) => {
  await page.goto("http://localhost:4200");
  await page.getByRole("link", { name: "person_add New patient" }).click();
  await expect(page).toHaveURL("http://localhost:4200/patients/create");

  const firstName = generateString(5);
  const lastName = generateString(5);

  await page.getByLabel("Given name").fill(firstName);
  await page.getByLabel("Family name").fill(lastName);
  await page.getByLabel("Name prefix").fill("Mr.");
  await page.locator('input[name="birthDate"]').fill("1994-01-01");
  await page.getByRole("combobox", { name: "Gender" }).selectOption("male");
  await page
    .getByRole("combobox", { name: "Martial Status" })
    .selectOption("S");
  await page.locator('input[name="telecom\\.0\\.value"]').fill("55503053");

  await page.locator('input[name="address\\.0\\.text"]').fill("Address Text");
  await page
    .locator('input[name="address\\.0\\.line.0"]')
    .fill("Address Line 1");
  await page
    .locator('input[name="address\\.0\\.line.1"]')
    .fill("Address Line 2");
  await page.locator('input[name="address\\.0\\.city"]').fill("Addis Ababa");
  await page.locator('input[name="address\\.0\\.state"]').fill("Addis Ababa");
  await page.locator('input[name="address\\.0\\.country"]').fill("Ethiopia");


  const responsePromise = page.waitForResponse("**/patients");
  await page.getByRole("button", { name: "save Save" }).click();
  const response = await responsePromise;
  const ok = response?.ok();

  expect(ok).toBeTruthy();

  if (ok) {
    const body = await response?.json();
    await expect(page).toHaveURL(`http://localhost:4200/patients/${body?.id}`);
  }

  await page.getByRole("link", { name: "person_add New patient" }).click();
  await expect(page).toHaveURL("http://localhost:4200/patients/create");

  await page.getByLabel("Given name").fill(firstName);
  await page.getByLabel("Family name").fill(lastName);
  await page.getByLabel("Name prefix").fill("Mr.");

  await page.getByRole("button", { name: "save Save" }).click();
  await page.getByText('Similar Patients Found');
});

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
