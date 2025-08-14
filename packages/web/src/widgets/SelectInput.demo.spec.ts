import { test, expect } from '@playwright/test';

test('SelectInput demo shows error state and changes value', async ({ page }) => {
  await page.goto('/__demos/SelectInput');
  const demo = page.getByTestId('SelectInputDemo');
  await expect(demo).toBeVisible();
  // First block
  const role = page.getByLabel('Role');
  await expect(role).toBeVisible();
  await role.selectOption('parent');
  await role.selectOption('child');
  // Error block should hide error when a value is chosen
  await page.getByLabel('With error').selectOption('parent');
  await expect(page.getByText('Please choose')).not.toBeVisible({ timeout: 1000 });
  // Disabled block remains unchanged
  const disabled = page.getByLabel('Disabled');
  await expect(disabled).toBeDisabled();
});

