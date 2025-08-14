import { test, expect } from '@playwright/test';

test('FormField demo renders label, help, and error', async ({ page }) => {
  await page.goto('/__demos/FormField');
  const demo = page.getByTestId('FormFieldDemo');
  await expect(demo).toBeVisible();
  await expect(page.getByText('Username')).toBeVisible();
  await expect(page.getByText('With help')).toBeVisible();
  await expect(page.getByText('This appears below the field.')).toBeVisible();
  await expect(page.getByText('With error')).toBeVisible();
  await expect(page.getByText('Something went wrong')).toBeVisible();
});

