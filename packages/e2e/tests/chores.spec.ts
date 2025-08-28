import {test, expect} from '@playwright/test';
import {setupFamily} from './helpers/test-utils';

test.describe('chores Workflow', () => {
  test('should display admin interface with user management', async ({
    page,
  }) => {
    // Set up family
    await setupFamily(page);

    // Navigate to admin page
    await page.goto('/admin');
    await expect(page).toHaveURL('/admin');

    // Should see admin interface
    await expect
      .soft(page.getByRole('heading', {name: 'Admin Panel'}))
      .toBeVisible();

    // Should see chore statistics section
    await expect(page.getByText('Total Chores')).toBeVisible();
    await expect(page.getByText('Pending Approval')).toBeVisible();
    await expect(page.getByText('Approved')).toBeVisible();
    await expect(page.getByText('Bonus Chores')).toBeVisible();

    // Should see users management section with admin user
    await expect.soft(page.getByRole('cell', {name: 'admin'})).toBeVisible();
    await expect
      .soft(page.getByRole('cell', {name: 'admin@gitterdun.com'}))
      .toBeVisible();

    // Should see Delete buttons for user management
    await expect.soft(page.getByRole('button', {name: 'Delete'})).toBeVisible();
  });

  // Note: Additional test cases have been moved to chores.skip.spec.ts
  // These tests are skipped because they require functionality not yet implemented in the app
});
