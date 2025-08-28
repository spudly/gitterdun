import type {Page} from '@playwright/test';
import {test, expect} from '@playwright/test';
import {setupFamilyWithChildren, loginAs} from './helpers/test-utils';

// Helper for creating chore with bonus points
const createChoreWithBonus = async (
  page: Page,
  choreTitle: string,
  basePoints: string,
) => {
  await page.goto('/admin');
  await page.getByRole('button', {name: 'Create Chore'}).click();
  await page.getByPlaceholder(/title/i).fill(choreTitle);
  await page.getByRole('spinbutton').fill(basePoints);

  const bonusInput = page.getByPlaceholder(/bonus/i);
  if ((await bonusInput.count()) > 0) {
    await bonusInput.fill('5');
  }

  await page.getByRole('button', {name: 'Create'}).click();
};

// Helper for assigning chore
const assignChore = async (
  page: Page,
  choreTitle: string,
  childUsername: string,
) => {
  await page
    .getByText(choreTitle)
    .getByRole('button', {name: 'Assign'})
    .click();
  await page.getByRole('combobox').selectOption(childUsername);
  await page.getByRole('button', {name: 'Assign Chore'}).click();
};

// Helper for completing chore as child
const completeChore = async (
  page: Page,
  choreTitle: string,
  childUsername: string,
) => {
  await loginAs(page, childUsername, 'childpassword123');
  await page.goto('/chores');
  await page
    .getByText(choreTitle)
    .getByRole('button', {name: 'Complete'})
    .click();
};

// Helper for approving chore as parent
const approveChore = async (
  page: Page,
  choreTitle: string,
  parent: {username: string; password: string},
) => {
  await loginAs(page, parent.username, parent.password);
  await page.goto('/admin');
  await page
    .getByText(choreTitle)
    .getByRole('button', {name: 'Approve'})
    .click();
};

test.describe('leaderboard Bonus Points - Skipped Tests', () => {
  test('should handle bonus points correctly', async ({page}) => {
    const {parent, child1} = await setupFamilyWithChildren(page);
    const choreTitle = `Bonus Chore ${Date.now()}`;

    await createChoreWithBonus(page, choreTitle, '10');
    await assignChore(page, choreTitle, child1.username);
    await completeChore(page, choreTitle, child1.username);
    await approveChore(page, choreTitle, parent);

    await page.goto('/leaderboard');
    await expect(page.getByText('15')).toBeVisible();
  });
});
