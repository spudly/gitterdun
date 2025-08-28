import type {Page} from '@playwright/test';
import {test, expect} from '@playwright/test';
import {setupFamilyWithChildren, loginAs} from './helpers/test-utils';

// Helper function to create and complete a chore (would need to be implemented when chore functionality exists)
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

test.describe('leaderboard Points System - Skipped Tests', () => {
  test.skip('should track points from completed chores', async ({page}) => {
    const {parent, child1} = await setupFamilyWithChildren(page);
    const choreTitle = `Points Chore ${Date.now()}`;

    await createAndCompleteChore(page, {
      choreTitle,
      points: '20',
      childUsername: child1.username,
      parent,
    });

    await page.goto('/leaderboard');
    await expect(page.getByText(child1.username)).toBeVisible();
    await expect(page.getByText('20')).toBeVisible();
  });

  test.skip('should show cumulative points from multiple chores', async ({
    page,
  }) => {
    const {parent, child1} = await setupFamilyWithChildren(page);

    await createAndCompleteChore(page, {
      choreTitle: `Chore 1 ${Date.now()}`,
      points: '15',
      childUsername: child1.username,
      parent,
    });
    await createAndCompleteChore(page, {
      choreTitle: `Chore 2 ${Date.now()}`,
      points: '25',
      childUsername: child1.username,
      parent,
    });

    await page.goto('/leaderboard');
    await expect(page.getByText(child1.username)).toBeVisible();
    await expect(page.getByText('40')).toBeVisible();
  });

  test.skip('should update leaderboard when new chores are completed', async ({
    page,
  }) => {
    const {parent, child1} = await setupFamilyWithChildren(page);

    await page.goto('/leaderboard');
    await expect(page.getByText(child1.username)).toBeVisible();

    await createAndCompleteChore(page, {
      choreTitle: `New Chore ${Date.now()}`,
      points: '50',
      childUsername: child1.username,
      parent,
    });

    await page.goto('/leaderboard');
    await expect(page.getByText('50')).toBeVisible();
  });
});
