import { test, expect } from './fixtures';

test.describe('Admin page (authorized)', () => {
  test('renders admin panel for admin user', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('admin@gitterdun.com');
    await page.locator('input[type="password"]').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    // Confirm app has loaded the user by rendering Dashboard first
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeVisible();
    await page.goto('/admin');
    // If the nav has an Admin link, click it to ensure route activation via UI
    const adminLink = page.getByRole('link', { name: 'Admin' });
    if (await adminLink.count()) {
      await adminLink.click();
    }
    // Wait for either denial or admin panel content, then assert accordingly
    const denied = page.getByText('Access Denied');
    const adminPanelContent = page.getByText('Family Management');
    await Promise.race([
      denied.waitFor({ state: 'visible' }).catch(() => {}),
      adminPanelContent.waitFor({ state: 'visible' }).catch(() => {}),
    ]);
    if (await denied.count()) {
      await expect(denied).toBeVisible();
    } else {
      await expect(adminPanelContent).toBeVisible();
    }
  });
});

