import {test, expect} from '@playwright/test';

test('chores page loads and renders list container', async ({page}) => {
  await page.goto('/login');
  await page.locator('input[type="email"]').fill('admin@gitterdun.com');
  await page.locator('input[type="password"]').fill('admin123');
  await page.getByRole('button', {name: 'Login'}).click();
  await page.goto('/');
  await page.getByRole('link', {name: 'Chores'}).click();
  await expect(
    page.getByRole('heading', {level: 1, name: 'Chores'}),
  ).toBeVisible();
  // Ensure list container exists in DOM
  const list = page.locator('ul');
  expect(await list.count()).toBeGreaterThan(0);
});
