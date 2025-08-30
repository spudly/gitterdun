import type {Page} from '@playwright/test';
import {test, expect} from '@playwright/test';
import {setupFamilyWithChildren, loginAs} from './helpers/test-utils';

// Helper function for creating and completing chores
const createAndCompleteChore = async (
  page: Page,
  options: {
    choreTitle: string;
    points: string;
    childUsername: string;
    parent: {username: string; password: string};
  },
) => {
  const {choreTitle, points, childUsername, parent} = options;

  await page.goto('/admin');
  await page.getByRole('button', {name: 'Create Chore'}).click();
  await page.getByPlaceholder(/title/i).fill(choreTitle);
  await page.getByRole('spinbutton').fill(points);
  await page.getByRole('button', {name: 'Create'}).click();

  await page
    .getByText(choreTitle)
    .getByRole('button', {name: 'Assign'})
    .click();
  await page.getByRole('combobox').selectOption(childUsername);
  await page.getByRole('button', {name: 'Assign Chore'}).click();

  await loginAs(page, childUsername, 'childpassword123');
  await page.goto('/chores');
  await page
    .getByText(choreTitle)
    .getByRole('button', {name: 'Complete'})
    .click();

  await loginAs(page, parent.username, parent.password);
  await page.goto('/admin');
  await page
    .getByText(choreTitle)
    .getByRole('button', {name: 'Approve'})
    .click();
};

test.describe('leaderboard Navigation - Skipped Tests', () => {
  test('should allow navigation between pages while maintaining leaderboard state', async ({
    page,
  }) => {
    const {parent, child1} = await setupFamilyWithChildren(page);

    await createAndCompleteChore(page, {
      choreTitle: `Nav Test ${Date.now()}`,
      points: '35',
      childUsername: child1.username,
      parent,
    });

    await page.goto('/leaderboard');
    await expect(page.getByText('35')).toBeVisible();

    await page.goto('/dashboard');
    await page.goto('/chores');
    await page.goto('/leaderboard');

    await expect(page.getByText('35')).toBeVisible();
  });
});
