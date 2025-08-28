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

test.describe('leaderboard Ranking - Skipped Tests', () => {
  test.skip('should show family members on leaderboard', async ({page}) => {
    const {child1, child2} = await setupFamilyWithChildren(page);
    await page.goto('/leaderboard');

    await expect(page.getByText(child1.username)).toBeVisible();
    await expect(page.getByText(child2.username)).toBeVisible();
  });

  test.skip('should rank children by points correctly', async ({page}) => {
    const {parent, child1, child2} = await setupFamilyWithChildren(page);

    await createAndCompleteChore(page, {
      choreTitle: `High Points ${Date.now()}`,
      points: '30',
      childUsername: child1.username,
      parent,
    });
    await createAndCompleteChore(page, {
      choreTitle: `Low Points ${Date.now()}`,
      points: '10',
      childUsername: child2.username,
      parent,
    });

    await page.goto('/leaderboard');
    const leaderboard = page.getByTestId('leaderboard');

    const allMembers = await leaderboard
      .getByTestId('leaderboard-member')
      .all();
    const memberTexts = await Promise.all(
      allMembers.map(async member => member.textContent()),
    );

    const child1Index = memberTexts.findIndex(text =>
      Boolean(text?.includes(child1.username)),
    );
    const child2Index = memberTexts.findIndex(text =>
      Boolean(text?.includes(child2.username)),
    );

    expect(child1Index).toBeLessThan(child2Index);
  });

  test.skip('should show leaderboard even with no completed chores', async ({
    page,
  }) => {
    const {child1, child2} = await setupFamilyWithChildren(page);
    await page.goto('/leaderboard');

    await expect(page.getByText(child1.username)).toBeVisible();
    await expect(page.getByText(child2.username)).toBeVisible();
  });
});
