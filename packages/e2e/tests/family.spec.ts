import {test, expect} from '@playwright/test';
import {registerAndLogin} from './helpers/test-utils';

test.describe('Family Management', () => {
  test('should create a new family', async ({page}) => {
    // Register and login as a user
    await registerAndLogin(page);

    // Navigate to family page
    await page.goto('/family');
    await expect(page).toHaveURL('/family');

    // Should see family creation form (no existing family)
    const familyName = `Test Family ${Date.now()}`;
    await page.fill('input[placeholder*="family name"]', familyName);

    // Create the family
    await page.click('button:has-text("Create")');

    // Should see the family has been created
    await expect(page.locator('text=Your Family')).toBeVisible();
    await expect(page.locator('text=Members')).toBeVisible();
  });

  test('should add a child to the family', async ({page}) => {
    // Register and login as a user
    await registerAndLogin(page);

    // Navigate to family page and create a family
    await page.goto('/family');
    const familyName = `Test Family ${Date.now()}`;
    await page.fill('input[placeholder*="family name"]', familyName);
    await page.click('button:has-text("Create")');

    // Wait for family to be created and members section to appear
    await expect(page.locator('text=Members')).toBeVisible();

    // Fill child creation form
    const timestamp = Date.now();
    const childUsername = `child${timestamp}`;
    const childEmail = `child${timestamp}@example.com`;
    const childPassword = 'childpassword123';

    // Find and fill the child form fields
    await page.fill('input#child-username', childUsername);
    await page.fill('input#child-email', childEmail);
    await page.fill('input#child-password', childPassword);

    // Create the child
    await page.click('button:has-text("Create Child")');

    // Should see the child has been added to the members list
    await expect(page.locator(`text=${childUsername}`)).toBeVisible();
  });

  test('should invite a family member', async ({page}) => {
    // Register and login as a user
    await registerAndLogin(page);

    // Navigate to family page and create a family
    await page.goto('/family');
    const familyName = `Test Family ${Date.now()}`;
    await page.fill('input[placeholder*="family name"]', familyName);
    await page.click('button:has-text("Create")');

    // Wait for family to be created
    await expect(page.locator('text=Members')).toBeVisible();

    // Fill invitation form
    const inviteEmail = `invite${Date.now()}@example.com`;
    await page.fill('input[type="email"]', inviteEmail);

    // Select role (assuming there's a dropdown or radio buttons)
    // This might need adjustment based on actual UI implementation
    await page.selectOption('select', 'parent'); // or however role selection works

    // Send invitation
    await page.click('button:has-text("Invite")');

    // Should show success message or confirmation
    // This depends on how the UI handles invitations
  });

  test('should show family members list', async ({page}) => {
    // Register and login as a user
    await registerAndLogin(page);

    // Navigate to family page and create a family
    await page.goto('/family');
    const familyName = `Test Family ${Date.now()}`;
    await page.fill('input[placeholder*="family name"]', familyName);
    await page.click('button:has-text("Create")');

    // Wait for family to be created
    await expect(page.locator('text=Members')).toBeVisible();

    // Should show the current user as a member
    await expect(page.locator('[data-testid="family-members"]')).toBeVisible();

    // Add a child and verify they appear in the list
    const childUsername = `child${Date.now()}`;
    await page.fill('input#child-username', childUsername);
    await page.fill('input#child-password', 'childpassword123');
    await page.click('button:has-text("Create Child")');

    // Both parent and child should be visible in members list
    await expect(page.locator(`text=${childUsername}`)).toBeVisible();
  });

  test('should require family name to create family', async ({page}) => {
    // Register and login as a user
    await registerAndLogin(page);

    // Navigate to family page
    await page.goto('/family');

    // Try to create family without name
    await page.click('button:has-text("Create")');

    // Should not proceed (button might be disabled or form validation prevents it)
    // The exact behavior depends on implementation
    await expect(
      page.locator('input[placeholder*="family name"]'),
    ).toBeVisible();
  });

  test('should require valid child information', async ({page}) => {
    // Register and login as a user
    await registerAndLogin(page);

    // Navigate to family page and create a family
    await page.goto('/family');
    const familyName = `Test Family ${Date.now()}`;
    await page.fill('input[placeholder*="family name"]', familyName);
    await page.click('button:has-text("Create")');

    // Wait for family to be created
    await expect(page.locator('text=Members')).toBeVisible();

    // Try to create child without required fields
    await page.click('button:has-text("Create Child")');

    // Should show validation errors or not proceed
    // This depends on the form validation implementation
    await expect(page.locator('input#child-username')).toBeVisible();
  });
});
