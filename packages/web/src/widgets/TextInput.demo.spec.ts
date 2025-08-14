import { test, expect } from '@playwright/test';

test('TextInput demo accepts typing and shows value', async ({ page }) => {
  await page.goto('/__demos/TextInput');
  const email = page.getByLabel('Email');
  await expect(email).toBeVisible();
  await email.fill('person@example.com');
  await expect(email).toHaveValue('person@example.com');
});

