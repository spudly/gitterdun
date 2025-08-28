import {test, expect} from '@playwright/test';
import {setupFamily, loginAs} from './helpers/test-utils';

test.describe('chores Completion - Skipped Tests', () => {
  test.skip('should complete a chore as child', async ({page}) => {
    const {child} = await setupFamily(page);
    await page.goto('/admin');
    const choreTitle = `Complete Me ${Date.now()}`;

    await page.getByRole('button', {name: 'Create Chore'}).click();
    await page.getByPlaceholder(/title/i).fill(choreTitle);
    await page.getByRole('spinbutton').fill('10');
    await page.getByRole('button', {name: 'Create'}).click();

    await page
      .getByText(choreTitle)

      .getByRole('button', {name: 'Assign'})
      .click();
    await page.getByRole('combobox').selectOption(child.username);
    await page.getByRole('button', {name: 'Assign Chore'}).click();

    await loginAs(page, child.username, child.password);
    await page.goto('/chores');
    await expect(page).toHaveURL('/chores');

    await expect(page.getByText(choreTitle)).toBeVisible();
    await page
      .getByText(choreTitle)

      .getByRole('button', {name: 'Complete'})
      .click();

    await expect(page.getByText('Completed')).toBeVisible();
  });

  test.skip('should approve completed chore as parent', async ({page}) => {
    const {parent, child} = await setupFamily(page);
    await page.goto('/admin');
    const choreTitle = `Approve Me ${Date.now()}`;

    await page.getByRole('button', {name: 'Create Chore'}).click();
    await page.getByPlaceholder(/title/i).fill(choreTitle);
    await page.getByRole('spinbutton').fill('15');
    await page.getByRole('button', {name: 'Create'}).click();

    await page
      .getByText(choreTitle)

      .getByRole('button', {name: 'Assign'})
      .click();
    await page.getByRole('combobox').selectOption(child.username);
    await page.getByRole('button', {name: 'Assign Chore'}).click();

    await loginAs(page, child.username, child.password);
    await page.goto('/chores');
    await page
      .getByText(choreTitle)

      .getByRole('button', {name: 'Complete'})
      .click();

    await loginAs(page, parent.username, parent.password);
    await page.goto('/admin');

    await expect(page.getByText(choreTitle)).toBeVisible();
    await expect(page.getByText('Completed')).toBeVisible();

    await page
      .getByText(choreTitle)

      .getByRole('button', {name: 'Approve'})
      .click();

    await expect(page.getByText('Approved')).toBeVisible();
  });

  test.skip('should reject completed chore as parent', async ({page}) => {
    const {parent, child} = await setupFamily(page);
    await page.goto('/admin');
    const choreTitle = `Reject Me ${Date.now()}`;

    await page.getByRole('button', {name: 'Create Chore'}).click();
    await page.getByPlaceholder(/title/i).fill(choreTitle);
    await page.getByRole('spinbutton').fill('8');
    await page.getByRole('button', {name: 'Create'}).click();

    await page
      .getByText(choreTitle)

      .getByRole('button', {name: 'Assign'})
      .click();
    await page.getByRole('combobox').selectOption(child.username);
    await page.getByRole('button', {name: 'Assign Chore'}).click();

    await loginAs(page, child.username, child.password);
    await page.goto('/chores');
    await page
      .getByText(choreTitle)

      .getByRole('button', {name: 'Complete'})
      .click();

    await loginAs(page, parent.username, parent.password);
    await page.goto('/admin');

    await page
      .getByText(choreTitle)

      .getByRole('button', {name: 'Reject'})
      .click();

    await expect(page.getByText('Pending')).toBeVisible();
  });
});
