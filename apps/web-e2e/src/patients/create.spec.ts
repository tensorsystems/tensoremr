import { expect, test } from "@playwright/test";

test("should start page", async ({ page }) => {
    await page.goto('http://localhost:4200');
    
    await page.getByRole('link', { name: 'person_add New patient' }).click();

    await expect(page).toHaveURL('http://localhost:4200/patients/create');
  });

// test("fill form", async ({ page}) => {
//     await page.goto('http://localhost:4200');
    
//     await page.getByRole('link', { name: 'person_add New patient' }).click();

//     await expect(page).toHaveURL('http://localhost:4200/patients/create');

//     await page.getByRole('link', { name: 'person_add New patient' }).click();
//     await page.getByLabel('Given name').click();
//     await page.getByLabel('Given name').fill('Test');
//     await page.getByLabel('Given name').press('Tab');
//     await page.getByLabel('Family name').fill('Patient');
//     await page.getByLabel('Family name').press('Tab');
//     await page.getByLabel('Name prefix').fill('Mr.');
//     await page.getByRole('button', { name: 'Options' }).click();
//     await page.getByRole('menuitem', { name: 'Enter Age In Years' }).click();
//     await page.getByRole('spinbutton').click();
//     await page.getByRole('spinbutton').fill('25');
//     await page.getByRole('combobox', { name: 'Gender' }).selectOption('male');
//     await page.getByRole('combobox', { name: 'Martial Status' }).selectOption('U');
//     await page.getByLabel('Value').click();
//     await page.getByLabel('Value').fill('555012405');
//     await page.getByText('Telecom 1').click();
//     await page.locator('#telecomValue').click();
//     await page.locator('#telecomValue').fill('555012405');
//     await page.getByRole('button', { name: 'add' }).first().click();
//     await page.locator('input[name="telecom\\.1\\.value"]').click();
//     await page.locator('input[name="telecom\\.1\\.value"]').fill('55503053');
// })