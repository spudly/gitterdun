import {test, expect} from '@playwright/test';

test('dashboard shows stats and recent chores after login', async ({page}) => {
  await page.goto('/login');
  await page.locator('input[type="email"]').fill('admin@gitterdun.com');
  await page.locator('input[type="password"]').fill('admin123');
  await page.getByRole('button', {name: 'Login'}).click();
  await page.goto('/');
  await expect(
    page.getByRole('heading', {level: 1, name: 'Dashboard'}),
  ).toBeVisible();
  await expect(page.getByText('Completed Chores')).toBeVisible();
  await expect(page.getByText('Pending Chores')).toBeVisible();
  await expect(page.getByText('Total Points')).toBeVisible();
  await expect(page.getByText('Due Soon')).toBeVisible();
  await expect(page.getByText('Recent Chores')).toBeVisible();
  // Ensure a recent item block exists
  // Assert the recent list container exists in the DOM
  const recentList = page.locator('div.divide-y');
  expect(await recentList.count()).toBeGreaterThan(0);
});
