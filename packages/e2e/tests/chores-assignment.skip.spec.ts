import {test, expect} from '@playwright/test';
import {setupFamily} from './helpers/test-utils';

test.describe('Chores Assignment - Skipped Tests', () => {
  test.skip('should assign chore to child', async ({page}) => {
    const {child} = await setupFamily(page);
    await page.goto('/admin');
    const choreTitle = `Assigned Chore ${Date.now()}`;

    await page.click('button:has-text("Create Chore")');
    await page.fill('input[placeholder*="title"]', choreTitle);
    await page.fill('input[type="number"]', '5');
    await page.click('button:has-text("Create")');

    await page
      .locator(`text=${choreTitle}`)
      .locator('..')
      .locator('button:has-text("Assign")')
      .click();
    await page.selectOption('select', child.username);
    await page.click('button:has-text("Assign Chore")');

    await expect(
      page.locator(`text=Assigned to: ${child.username}`),
    ).toBeVisible();
  });
});
