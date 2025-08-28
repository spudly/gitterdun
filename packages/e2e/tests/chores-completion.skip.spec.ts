import {test, expect} from '@playwright/test';
import {setupFamily, loginAs} from './helpers/test-utils';

test.describe('chores Completion - Skipped Tests', () => {
  test.skip('should complete a chore as child', async ({page}) => {
    const {child} = await setupFamily(page);
    await page.goto('/admin');
    const choreTitle = `Complete Me ${Date.now()}`;

    await page.click('button:has-text("Create Chore")');
    await page.fill('input[placeholder*="title"]', choreTitle);
    await page.fill('input[type="number"]', '10');
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
    await expect.soft(page).toHaveURL('/chores');

    await expect.soft(page.locator(`text=${choreTitle}`)).toBeVisible();
    await page
      .locator(`text=${choreTitle}`)
      .locator('..')
      .locator('button:has-text("Complete")')
      .click();

    await expect.soft(page.locator('text=Completed')).toBeVisible();
  });

  test.skip('should approve completed chore as parent', async ({page}) => {
    const {parent, child} = await setupFamily(page);
    await page.goto('/admin');
    const choreTitle = `Approve Me ${Date.now()}`;

    await page.click('button:has-text("Create Chore")');
    await page.fill('input[placeholder*="title"]', choreTitle);
    await page.fill('input[type="number"]', '15');
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
    await page
      .locator(`text=${choreTitle}`)
      .locator('..')
      .locator('button:has-text("Complete")')
      .click();

    await loginAs(page, parent.username, parent.password);
    await page.goto('/admin');

    await expect.soft(page.locator(`text=${choreTitle}`)).toBeVisible();
    await expect.soft(page.locator('text=Completed')).toBeVisible();

    await page
      .locator(`text=${choreTitle}`)
      .locator('..')
      .locator('button:has-text("Approve")')
      .click();

    await expect.soft(page.locator('text=Approved')).toBeVisible();
  });

  test.skip('should reject completed chore as parent', async ({page}) => {
    const {parent, child} = await setupFamily(page);
    await page.goto('/admin');
    const choreTitle = `Reject Me ${Date.now()}`;

    await page.click('button:has-text("Create Chore")');
    await page.fill('input[placeholder*="title"]', choreTitle);
    await page.fill('input[type="number"]', '8');
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
      .locator('button:has-text("Reject")')
      .click();

    await expect.soft(page.locator('text=Pending')).toBeVisible();
  });
});
