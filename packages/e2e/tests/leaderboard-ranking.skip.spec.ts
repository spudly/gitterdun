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
  await page.click('button:has-text("Create Chore")');
  await page.fill('input[placeholder*="title"]', choreTitle);
  await page.fill('input[type="number"]', points);
  await page.click('button:has-text("Create")');

  await page
    .locator(`text=${choreTitle}`)
    .locator('..')
    .locator('button:has-text("Assign")')
    .click();
  await page.selectOption('select', childUsername);
  await page.click('button:has-text("Assign Chore")');

  await loginAs(page, childUsername, 'childpassword123');
  await page.goto('/chores');
  await page
    .locator(`text=${choreTitle}`)
    .locator('..')
    .locator('button:has-text("Complete")')
    .click();

  await loginAs(page, parent.username, parent.password);
  await page.goto('/admin');
  await page
    .locator(`text=${choreTitle}`)
    .locator('..')
    .locator('button:has-text("Approve")')
    .click();
};

test.describe('leaderboard Ranking - Skipped Tests', () => {
  test.skip('should show family members on leaderboard', async ({page}) => {
    const {child1, child2} = await setupFamilyWithChildren(page);
    await page.goto('/leaderboard');

    await expect.soft(page.locator(`text=${child1.username}`)).toBeVisible();
    await expect.soft(page.locator(`text=${child2.username}`)).toBeVisible();
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
    const leaderboard = page.getByTestId("leaderboard");

    const allMembers = await leaderboard
      .locator('[data-testid="leaderboard-member"]')
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

    expect.soft(child1Index).toBeLessThan(child2Index);
  });

  test.skip('should show leaderboard even with no completed chores', async ({
    page,
  }) => {
    const {child1, child2} = await setupFamilyWithChildren(page);
    await page.goto('/leaderboard');

    await expect.soft(page.locator(`text=${child1.username}`)).toBeVisible();
    await expect.soft(page.locator(`text=${child2.username}`)).toBeVisible();
  });
});
