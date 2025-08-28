import {test, expect} from '@playwright/test';

test.describe('authentication Flow', () => {
  test('should register a new user and redirect to dashboard', async ({
    page,
  }) => {
    await page.goto('/');
    // Navigate to register page
    await page.getByRole('link', {name: /register|sign up/i}).click();
    await expect(page).toHaveURL('/register');

    // Fill registration form
    const timestamp = Date.now();
    const username = `testuser${timestamp}`;
    const email = `test${timestamp}@example.com`;
    const password = 'testpassword123';

    await page.getByLabel('Username').fill(username);
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);

    // Submit registration
    await page.getByRole('button', {name: /submit|register|sign up/i}).click();

    // Should redirect to dashboard on successful registration
    await expect(page).toHaveURL('/');

    // Should see dashboard content
    await expect
      .soft(page.getByRole('heading', {name: 'Dashboard'}))
      .toBeVisible();
  });

  test('should login with existing credentials', async ({page}) => {
    // First register a user for testing
    await page.goto('/register');
    const timestamp = Date.now();
    const username = `loginuser${timestamp}`;
    const password = 'testpassword123';

    await page.getByLabel('Username').fill(username);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', {name: /submit|register|sign up/i}).click();
    await expect(page).toHaveURL('/');

    // Logout (assuming there's a way to logout)
    // For now, we'll clear storage to simulate logout
    await page.context().clearCookies();
    await page.reload();

    // Navigate to login page
    await page.goto('/login');
    await expect(page).toHaveURL('/login');

    // Fill login form
    await page.getByLabel(/email|username/i).fill(username);
    await page.getByLabel('Password').fill(password);

    // Submit login
    await page.getByRole('button', {name: /submit|login|sign in/i}).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL('/');

    // Should see dashboard content
    await expect
      .soft(page.getByRole('heading', {name: 'Dashboard'}))
      .toBeVisible();
  });

  test('should show error for invalid login credentials', async ({page}) => {
    await page.goto('/login');

    // Fill with invalid credentials
    await page.getByLabel(/email|username/i).fill('invalid@example.com');
    await page.getByLabel('Password').fill('wrongpassword');

    // Submit login
    await page.getByRole('button', {name: /submit|login|sign in/i}).click();

    // Should show error message
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText(/Login failed/i)).toBeVisible();

    // Should stay on login page
    await expect(page).toHaveURL('/login');
  });

  test('should require username and password for registration', async ({
    page,
  }) => {
    await page.goto('/register');

    // Try to submit empty form
    await page.getByRole('button', {name: /submit|register|sign up/i}).click();

    // Form should not submit (button should be disabled or form validation should prevent submission)
    await expect(page).toHaveURL('/register');
  });

  test('should navigate between login and register pages', async ({page}) => {
    await page.goto('/login');

    // Go to register page
    await page.getByRole('link', {name: /register|sign up/i}).click();
    await expect(page).toHaveURL('/register');

    // Should be able to go back to login
    await page.goBack();
    await expect(page).toHaveURL('/login');
  });
});
