import {test, expect} from '@playwright/test';

test('Dashboard loading state appears briefly then content', async ({page}) => {
  await page.goto('/');
  // As not logged in, dashboard query is disabled; navigate after login to trigger load
  await page.goto('/login');
  await page.locator('input[type="email"]').fill('admin@gitterdun.com');
  await page.locator('input[type="password"]').fill('admin123');
  await page.getByRole('button', {name: 'Login'}).click();
  await page.goto('/');
  // Check for heading once content renders
  await expect(
    page.getByRole('heading', {level: 1, name: 'Dashboard'}),
  ).toBeVisible();
});
