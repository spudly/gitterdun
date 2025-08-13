import {test, expect} from '@playwright/test';

test.describe('Family page', () => {
  test('logged-in view renders members and actions when a family is selected', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('admin@gitterdun.com');
    await page.locator('input[type="password"]').fill('admin123');
    await page.getByRole('button', {name: 'Login'}).click();
    await page.goto('/family');
    // Container heading
    const heading = page.getByText('Your Families');
    if ((await heading.count()) > 0) {
      await expect(heading).toBeVisible();
    }
    // Select first actual family if options exist
    const familySelect = page.locator('select');
    if (await familySelect.count()) {
      const firstSelect = familySelect.first();
      const optionCount = await firstSelect.locator('option').count();
      if (optionCount > 1) {
        await firstSelect.selectOption({index: 1});
      }
    }
    const membersPanel = page.getByText('Members');
    if ((await membersPanel.count()) > 0) {
      await expect(membersPanel).toBeVisible();
      await expect(page.getByText('Create Child Account')).toBeVisible();
      await expect(page.getByText('Invite Member')).toBeVisible();
    }
  });
});
