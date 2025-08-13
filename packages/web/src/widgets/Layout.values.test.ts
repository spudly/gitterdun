import {test, expect} from '@playwright/test';

test('Layout shows seeded points and streak after login', async ({page}) => {
  await page.goto('/login');
  await page.locator('input[type="email"]').fill('admin@gitterdun.com');
  await page.locator('input[type="password"]').fill('admin123');
  await page.getByRole('button', {name: 'Login'}).click();
  await page.waitForURL('**/');
  // Points: 42, Streak: 3 🔥 (from seed)
  await expect(page.getByText('Points:')).toBeVisible();
  await expect(page.getByText('42')).toBeVisible();
  await expect(page.getByText('Streak:')).toBeVisible();
  await expect(page.getByText('3')).toBeVisible();
});
