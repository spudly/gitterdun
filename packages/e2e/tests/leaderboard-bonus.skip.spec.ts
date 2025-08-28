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
  await page.click('button:has-text("Create Chore")');
  await page.fill('input[placeholder*="title"]', choreTitle);
  await page.fill('input[type="number"]', basePoints);

  const bonusInput = page.locator('input[placeholder*="bonus"]');
  if ((await bonusInput.count()) > 0) {
    await bonusInput.fill('5');
  }

  await page.click('button:has-text("Create")');
};

// Helper for assigning chore
const assignChore = async (
  page: Page,
  choreTitle: string,
  childUsername: string,
) => {
  await page
    .locator(`text=${choreTitle}`)
    .locator('..')
    .locator('button:has-text("Assign")')
    .click();
  await page.selectOption('select', childUsername);
  await page.click('button:has-text("Assign Chore")');
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
    .locator(`text=${choreTitle}`)
    .locator('..')
    .locator('button:has-text("Complete")')
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
    .locator(`text=${choreTitle}`)
    .locator('..')
    .locator('button:has-text("Approve")')
    .click();
};

test.describe('leaderboard Bonus Points - Skipped Tests', () => {
  test.skip('should handle bonus points correctly', async ({page}) => {
    const {parent, child1} = await setupFamilyWithChildren(page);
    const choreTitle = `Bonus Chore ${Date.now()}`;

    await createChoreWithBonus(page, choreTitle, '10');
    await assignChore(page, choreTitle, child1.username);
    await completeChore(page, choreTitle, child1.username);
    await approveChore(page, choreTitle, parent);

    await page.goto('/leaderboard');
    await expect.soft(page.locator('text=15')).toBeVisible();
  });
});
