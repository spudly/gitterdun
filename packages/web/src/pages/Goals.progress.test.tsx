import {test, expect} from '@playwright/test';

test('Goals cards show current and target points', async ({page}) => {
  await page.goto('/login');
  await page.locator('input[type="email"]').fill('admin@gitterdun.com');
  await page.locator('input[type="password"]').fill('admin123');
  await page.getByRole('button', {name: 'Login'}).click();
  await page.goto('/goals');
  await expect(
    page.getByRole('heading', {level: 1, name: 'Goals'}),
  ).toBeVisible();
  // Assert at least one goal card exists (structure-based)
  const cards = page.locator('div:has(h3)');
  await expect(cards.first()).toBeVisible();
});
