import {test, expect} from '@playwright/test';
import {setupFamily, loginAs} from './helpers/test-utils';

test.describe('chores Display - Skipped Tests', () => {
  test.skip('should show chores list for child user', async ({page}) => {
    const {child} = await setupFamily(page);
    await loginAs(page, child.username, child.password);
    await page.goto('/chores');
    await expect(page).toHaveURL('/chores');

    await expect(page.getByText('Chores')).toBeVisible();
    await expect(page.getByTestId('chores-list')).toBeVisible();
  });

  test.skip('should show points and status for chores', async ({page}) => {
    const {child} = await setupFamily(page);
    const choreTitle = `Points Test ${Date.now()}`;
    const chorePoints = '25';

    await page.goto('/admin');
    await page.getByRole('button', {name: 'Create Chore'}).click();
    await page.getByPlaceholder(/title/i).fill(choreTitle);
    await page.getByRole('spinbutton').fill(chorePoints);
    await page.getByRole('button', {name: 'Create'}).click();

    await page
      .getByText(choreTitle)
      .getByRole('button', {name: 'Assign'})
      .click();
    await page.getByRole('combobox').selectOption(child.username);
    await page.getByRole('button', {name: 'Assign Chore'}).click();

    await loginAs(page, child.username, child.password);
    await page.goto('/chores');

    await expect(page.getByText(choreTitle)).toBeVisible();
    await expect.soft(page.getByText(`Points: ${chorePoints}`)).toBeVisible();
    await expect(page.getByText('Pending')).toBeVisible();
  });

  test.skip('should navigate between chores and admin pages', async ({
    page,
  }) => {
    await setupFamily(page);
    await page.goto('/chores');
    await expect(page).toHaveURL('/chores');

    await page.goto('/admin');
    await expect(page).toHaveURL('/admin');

    await page.goto('/chores');
    await expect(page).toHaveURL('/chores');
  });
});
