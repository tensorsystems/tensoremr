// auth.setup.ts
import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto('http://localhost:4200/auth');
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('receptionist@tensoremr.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('changeme1');
  await page.getByPlaceholder('Password').press('Enter'); 

  await page.waitForURL('http://localhost:4200');

  await page.context().storageState({ path: authFile });
});