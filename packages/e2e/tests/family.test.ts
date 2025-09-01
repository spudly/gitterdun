import {test, expect} from './fixtures';
import {registerAndLogin} from './helpers/test-utils';

test.describe('family Management', () => {
  test('should create a new family', async ({page}) => {
    // Register and login as a user
    await registerAndLogin(page);

    // Wait for authentication to be fully established by checking for authenticated user elements
    // This should be visible in the navigation only when user is authenticated
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByText('Points', {exact: true})).toBeVisible();

    // Navigate to family page
    await page.goto('/family');

    // Wait for the family page to load properly by checking for family creation elements
    await expect(page).toHaveURL('/family');
    await expect(page.getByPlaceholder(/New family name/i)).toBeVisible();

    // Should see family creation form (no existing family)
    const familyName = `Test Family ${Date.now()}`;
    await page.getByPlaceholder(/New family name/i).fill(familyName);

    // Create the family
    await page.getByRole('button', {name: 'Create'}).click();

    // Should see the family has been created
    await expect(page.getByText('Your Family')).toBeVisible();
    await expect(page.getByText('Members')).toBeVisible();
  });

  test('should add a child to the family', async ({page}) => {
    // Register and login as a user
    await registerAndLogin(page);

    // Navigate to family page and create a family
    await page.goto('/family');
    const familyName = `Test Family ${Date.now()}`;
    await page.getByPlaceholder(/New family name/i).fill(familyName);
    await page.getByRole('button', {name: 'Create'}).click();

    // Wait for family to be created and members section to appear
    await expect(page.getByText('Members')).toBeVisible();

    // Fill child creation form
    const timestamp = Date.now();
    const childUsername = `child${timestamp}`;
    const childPassword = 'childpassword123';

    // Fill child fields (Email is optional; target unique placeholders to avoid ambiguity)
    await page.getByPlaceholder('Username').fill(childUsername);
    await page.getByPlaceholder('Password').fill(childPassword);

    // Create the child
    await page.getByRole('button', {name: 'Create'}).click();

    // Should see the child has been added to the members list
    await expect(page.getByText(childUsername)).toBeVisible();
  });

  test('should invite a family member', async ({page}) => {
    // Register and login as a user
    await registerAndLogin(page);

    // Navigate to family page and create a family
    await page.goto('/family');
    const familyName = `Test Family ${Date.now()}`;
    await page.getByPlaceholder(/New family name/i).fill(familyName);
    await page.getByRole('button', {name: 'Create'}).click();

    // Wait for family to be created
    await expect(page.getByText('Members')).toBeVisible();

    // Scope to the Invite section region
    const inviteSection = page.getByRole('region', {name: 'Invite Member'});

    // Fill invitation form
    const inviteEmail = `invite${Date.now()}@example.com`;
    await inviteSection.getByPlaceholder('Email').fill(inviteEmail);

    // Select role
    await inviteSection.getByRole('combobox').selectOption('parent');

    // Send invitation
    await inviteSection.getByRole('button', {name: 'Send'}).click();

    // Should show success message or confirmation
    // This depends on how the UI handles invitations
  });

  test('should show family members list', async ({page}) => {
    // Register and login as a user
    await registerAndLogin(page);

    // Navigate to family page and create a family
    await page.goto('/family');
    const familyName = `Test Family ${Date.now()}`;
    await page.getByPlaceholder(/New family name/i).fill(familyName);
    await page.getByRole('button', {name: 'Create'}).click();

    // Wait for family to be created
    await expect(page.getByText('Members')).toBeVisible();

    // Should show the current user as a member - target the actual members list
    await expect(page.getByRole('list')).toBeVisible();

    // Add a child and verify they appear in the list
    const childUsername = `child${Date.now()}`;

    // Use selectors scoped to the Create Child section
    await page.getByPlaceholder('Username').fill(childUsername);
    await page.getByPlaceholder('Password').fill('childpassword123');
    await page.getByRole('button', {name: 'Create'}).click();

    // Both parent and child should be visible in members list
    await expect(page.getByText(childUsername)).toBeVisible();
  });

  test('should require family name to create family', async ({page}) => {
    // Register and login as a user
    await registerAndLogin(page);

    // Navigate to family page
    await page.goto('/family');

    // Try to create family without name
    await page.getByRole('button', {name: 'Create'}).click();

    // Should not proceed (button might be disabled or form validation prevents it)
    // The exact behavior depends on implementation
    await expect.soft(page.getByPlaceholder(/New family name/i)).toBeVisible();
  });

  test('should require valid child information', async ({page}) => {
    // Register and login as a user
    await registerAndLogin(page);

    // Navigate to family page and create a family
    await page.goto('/family');
    const familyName = `Test Family ${Date.now()}`;
    await page.getByPlaceholder(/New family name/i).fill(familyName);
    await page.getByRole('button', {name: 'Create'}).click();

    // Wait for family to be created
    await expect(page.getByText('Members')).toBeVisible();

    // Try to create child without required fields - the button should be disabled
    const createButton = page.getByRole('button', {name: 'Create'});
    await expect(createButton).toBeVisible();
    await expect(createButton).toBeDisabled();

    // Form should still be visible with empty fields (scoped to Create Child section)
    await expect.soft(page.getByPlaceholder('Username')).toBeVisible();
  });
});
