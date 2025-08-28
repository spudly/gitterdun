import {test, expect} from '@playwright/test';
import {setupFamily} from './helpers/test-utils';

test.describe('chores Assignment - Skipped Tests', () => {
  test('should assign chore to child', async ({page}) => {
    const {child} = await setupFamily(page);
    await page.goto('/admin');
    const choreTitle = `Assigned Chore ${Date.now()}`;

    await page.getByRole('button', {name: 'Create Chore'}).click();
    await page.getByPlaceholder(/title/i).fill(choreTitle);
    await page.getByRole('spinbutton').fill('5');
    await page.getByRole('button', {name: 'Create'}).click();

    await page
      .getByText(choreTitle)
      .getByRole('button', {name: 'Assign'})
      .click();
    await page.getByRole('combobox').selectOption(child.username);
    await page.getByRole('button', {name: 'Assign Chore'}).click();

    await expect
      .soft(page.getByText(`Assigned to: ${child.username}`))
      .toBeVisible();
  });
});
