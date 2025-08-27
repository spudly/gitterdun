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

test.describe('Leaderboard Navigation - Skipped Tests', () => {
  test.skip('should allow navigation between pages while maintaining leaderboard state', async ({
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
    await expect(page.locator('text=35')).toBeVisible();

    await page.goto('/dashboard');
    await page.goto('/chores');
    await page.goto('/leaderboard');

    await expect(page.locator('text=35')).toBeVisible();
  });
});
