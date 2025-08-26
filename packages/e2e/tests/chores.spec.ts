import {test, expect} from '@playwright/test';
import {setupFamily, loginAs} from './helpers/test-utils';

test.describe('Chores Workflow', () => {
  test('should create a new chore as admin', async ({page}) => {
    // Set up family
    await setupFamily(page);

    // Navigate to admin page (assuming parent has admin access)
    await page.goto('/admin');
    await expect(page).toHaveURL('/admin');

    // Should see admin interface
    await expect(page.locator('text=Admin')).toBeVisible();

    // Create a new chore
    const choreTitle = `Test Chore ${Date.now()}`;
    const choreDescription = 'This is a test chore for e2e testing';
    const chorePoints = '10';

    // Fill chore creation form (exact selectors may need adjustment)
    await page.click('button:has-text("Create Chore")');
    await page.fill('input[placeholder*="title"]', choreTitle);
    await page.fill('textarea[placeholder*="description"]', choreDescription);
    await page.fill('input[type="number"]', chorePoints);

    // Submit chore
    await page.click('button:has-text("Create")');

    // Should see the chore in the list
    await expect(page.locator(`text=${choreTitle}`)).toBeVisible();
  });

  test('should assign chore to child', async ({page}) => {
    // Set up family
    const {child} = await setupFamily(page);

    // Navigate to admin and create a chore
    await page.goto('/admin');
    const choreTitle = `Assigned Chore ${Date.now()}`;

    // Create chore (assuming there's a way to do this in admin)
    await page.click('button:has-text("Create Chore")');
    await page.fill('input[placeholder*="title"]', choreTitle);
    await page.fill('input[type="number"]', '5');
    await page.click('button:has-text("Create")');

    // Assign chore to child
    await page
      .locator(`text=${choreTitle}`)
      .locator('..')
      .locator('button:has-text("Assign")')
      .click();
    await page.selectOption('select', child.username);
    await page.click('button:has-text("Assign Chore")');

    // Verify assignment
    await expect(
      page.locator(`text=Assigned to: ${child.username}`),
    ).toBeVisible();
  });

  test('should complete a chore as child', async ({page}) => {
    // Set up family and create assigned chore
    const {child} = await setupFamily(page);

    // Create and assign chore as parent
    await page.goto('/admin');
    const choreTitle = `Complete Me ${Date.now()}`;
    await page.click('button:has-text("Create Chore")');
    await page.fill('input[placeholder*="title"]', choreTitle);
    await page.fill('input[type="number"]', '10');
    await page.click('button:has-text("Create")');

    // Assign to child
    await page
      .locator(`text=${choreTitle}`)
      .locator('..')
      .locator('button:has-text("Assign")')
      .click();
    await page.selectOption('select', child.username);
    await page.click('button:has-text("Assign Chore")');

    // Login as child
    await loginAs(page, child.username, child.password);

    // Navigate to chores page
    await page.goto('/chores');
    await expect(page).toHaveURL('/chores');

    // Should see the assigned chore
    await expect(page.locator(`text=${choreTitle}`)).toBeVisible();

    // Complete the chore
    await page
      .locator(`text=${choreTitle}`)
      .locator('..')
      .locator('button:has-text("Complete")')
      .click();

    // Should see chore status changed
    await expect(page.locator('text=Completed')).toBeVisible();
  });

  test('should approve completed chore as parent', async ({page}) => {
    // Set up family and create/complete chore
    const {parent, child} = await setupFamily(page);

    // Create and assign chore as parent
    await page.goto('/admin');
    const choreTitle = `Approve Me ${Date.now()}`;
    await page.click('button:has-text("Create Chore")');
    await page.fill('input[placeholder*="title"]', choreTitle);
    await page.fill('input[type="number"]', '15');
    await page.click('button:has-text("Create")');

    // Assign to child
    await page
      .locator(`text=${choreTitle}`)
      .locator('..')
      .locator('button:has-text("Assign")')
      .click();
    await page.selectOption('select', child.username);
    await page.click('button:has-text("Assign Chore")');

    // Login as child and complete chore
    await loginAs(page, child.username, child.password);
    await page.goto('/chores');
    await page
      .locator(`text=${choreTitle}`)
      .locator('..')
      .locator('button:has-text("Complete")')
      .click();

    // Login back as parent
    await loginAs(page, parent.username, parent.password);

    // Navigate to admin to see completed chores
    await page.goto('/admin');

    // Should see completed chore with approve/reject options
    await expect(page.locator(`text=${choreTitle}`)).toBeVisible();
    await expect(page.locator('text=Completed')).toBeVisible();

    // Approve the chore
    await page
      .locator(`text=${choreTitle}`)
      .locator('..')
      .locator('button:has-text("Approve")')
      .click();

    // Should see chore status changed to approved
    await expect(page.locator('text=Approved')).toBeVisible();
  });

  test('should reject completed chore as parent', async ({page}) => {
    // Set up family and create/complete chore
    const {parent, child} = await setupFamily(page);

    // Create, assign, and complete chore (similar to approve test)
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

    // Complete as child
    await loginAs(page, child.username, child.password);
    await page.goto('/chores');
    await page
      .locator(`text=${choreTitle}`)
      .locator('..')
      .locator('button:has-text("Complete")')
      .click();

    // Reject as parent
    await loginAs(page, parent.username, parent.password);
    await page.goto('/admin');

    // Reject the chore
    await page
      .locator(`text=${choreTitle}`)
      .locator('..')
      .locator('button:has-text("Reject")')
      .click();

    // Should see chore back to pending status
    await expect(page.locator('text=Pending')).toBeVisible();
  });

  test('should show chores list for child user', async ({page}) => {
    // Set up family
    const {child} = await setupFamily(page);

    // Login as child
    await loginAs(page, child.username, child.password);

    // Navigate to chores page
    await page.goto('/chores');
    await expect(page).toHaveURL('/chores');

    // Should see chores page header
    await expect(page.locator('text=Chores')).toBeVisible();

    // Should see list of chores (even if empty)
    await expect(page.locator('[data-testid="chores-list"]')).toBeVisible();
  });

  test('should show points and status for chores', async ({page}) => {
    // Set up family and create chore
    const {child} = await setupFamily(page);

    const choreTitle = `Points Test ${Date.now()}`;
    const chorePoints = '25';

    await page.goto('/admin');
    await page.click('button:has-text("Create Chore")');
    await page.fill('input[placeholder*="title"]', choreTitle);
    await page.fill('input[type="number"]', chorePoints);
    await page.click('button:has-text("Create")');

    // Assign to child
    await page
      .locator(`text=${choreTitle}`)
      .locator('..')
      .locator('button:has-text("Assign")')
      .click();
    await page.selectOption('select', child.username);
    await page.click('button:has-text("Assign Chore")');

    // Login as child to view chore
    await loginAs(page, child.username, child.password);
    await page.goto('/chores');

    // Should see chore with points
    await expect(page.locator(`text=${choreTitle}`)).toBeVisible();
    await expect(page.locator(`text=Points: ${chorePoints}`)).toBeVisible();
    await expect(page.locator('text=Pending')).toBeVisible();
  });

  test('should navigate between chores and admin pages', async ({page}) => {
    // Set up family
    await setupFamily(page);

    // Navigate to chores page
    await page.goto('/chores');
    await expect(page).toHaveURL('/chores');

    // Navigate to admin page
    await page.goto('/admin');
    await expect(page).toHaveURL('/admin');

    // Should be able to navigate back
    await page.goto('/chores');
    await expect(page).toHaveURL('/chores');
  });
});
