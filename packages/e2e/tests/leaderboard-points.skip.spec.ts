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
    await expect.soft(page.locator(`text=${child1.username}`)).toBeVisible();
    await expect.soft(page.locator('text=20')).toBeVisible();
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
    await expect.soft(page.locator(`text=${child1.username}`)).toBeVisible();
    await expect.soft(page.locator('text=40')).toBeVisible();
  });

  test.skip('should update leaderboard when new chores are completed', async ({
    page,
  }) => {
    const {parent, child1} = await setupFamilyWithChildren(page);

    await page.goto('/leaderboard');
    await expect.soft(page.locator(`text=${child1.username}`)).toBeVisible();

    await createAndCompleteChore(page, {
      choreTitle: `New Chore ${Date.now()}`,
      points: '50',
      childUsername: child1.username,
      parent,
    });

    await page.goto('/leaderboard');
    await expect.soft(page.locator('text=50')).toBeVisible();
  });
});
