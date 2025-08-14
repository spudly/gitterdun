import { test, expect } from './fixtures';

test.describe('Additional auth edge cases', () => {
  test('reset password with invalid token shows error', async ({ page }) => {
    await page.goto('/reset-password?token=invalid');
    await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();
    await page.getByLabel('New Password').fill('secret123');
    await page.getByLabel('Confirm Password').fill('secret123');
    await page.getByRole('button', { name: 'Reset Password' }).click();
    await expect(page.getByText('Reset failed')).toBeVisible();
  });

  test('accept invitation with invalid token shows failure', async ({ page }) => {
    await page.goto('/accept-invitation?token=invalid');
    await expect(page.getByRole('heading', { name: 'Accept Invitation' })).toBeVisible();
    await page.getByLabel('Username').fill(`kid-${Date.now()}`);
    await page.getByLabel('Password').fill('pw123456');
    await page.getByRole('button', { name: 'Accept Invitation' }).click();
    await expect(page.getByText('Failed to accept')).toBeVisible();
  });
});

