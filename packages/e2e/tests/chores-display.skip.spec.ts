import {test, expect} from '@playwright/test';
import {setupFamily, loginAs} from './helpers/test-utils';

test.describe('chores Display - Skipped Tests', () => {
  test.skip('should show chores list for child user', async ({page}) => {
    const {child} = await setupFamily(page);
    await loginAs(page, child.username, child.password);
    await page.goto('/chores');
    await expect.soft(page).toHaveURL('/chores');

    await expect.soft(page.locator('text=Chores')).toBeVisible();
    await expect.soft(page.getByTestId("chores-list")).toBeVisible();
  });

  test.skip('should show points and status for chores', async ({page}) => {
    const {child} = await setupFamily(page);
    const choreTitle = `Points Test ${Date.now()}`;
    const chorePoints = '25';

    await page.goto('/admin');
    await page.click('button:has-text("Create Chore")');
    await page.fill('input[placeholder*="title"]', choreTitle);
    await page.fill('input[type="number"]', chorePoints);
    await page.click('button:has-text("Create")');

    await page
      .locator(`text=${choreTitle}`)
      .locator('..')
      .locator('button:has-text("Assign")')
      .click();
    await page.selectOption('select', child.username);
    await page.click('button:has-text("Assign Chore")');

    await loginAs(page, child.username, child.password);
    await page.goto('/chores');

    await expect.soft(page.locator(`text=${choreTitle}`)).toBeVisible();
    await expect.soft(page.locator(`text=Points: ${chorePoints}`)).toBeVisible();
    await expect.soft(page.locator('text=Pending')).toBeVisible();
  });

  test.skip('should navigate between chores and admin pages', async ({
    page,
  }) => {
    await setupFamily(page);
    await page.goto('/chores');
    await expect.soft(page).toHaveURL('/chores');

    await page.goto('/admin');
    await expect.soft(page).toHaveURL('/admin');

    await page.goto('/chores');
    await expect.soft(page).toHaveURL('/chores');
  });
});
