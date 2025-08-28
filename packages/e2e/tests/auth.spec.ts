import {test, expect} from '@playwright/test';

test.describe('authentication Flow', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
  });

  test('should register a new user and redirect to dashboard', async ({
    page,
  }) => {
    // Navigate to register page
    await page.click('a[href="/register"]');
    await expect.soft(page).toHaveURL('/register');

    // Fill registration form
    const timestamp = Date.now();
    const username = `testuser${timestamp}`;
    const email = `test${timestamp}@example.com`;
    const password = 'testpassword123';

    await page.fill('#username', username);
    await page.fill('#email', email);
    await page.fill('#password', password);

    // Submit registration
    await page.click('button[type="submit"]');

    // Should redirect to dashboard on successful registration
    await expect.soft(page).toHaveURL('/');

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

    await page.fill('#username', username);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');
    await expect.soft(page).toHaveURL('/');

    // Logout (assuming there's a way to logout)
    // For now, we'll clear storage to simulate logout
    await page.context().clearCookies();
    await page.reload();

    // Navigate to login page
    await page.goto('/login');
    await expect.soft(page).toHaveURL('/login');

    // Fill login form
    await page.fill('#email', username);
    await page.fill('#password', password);

    // Submit login
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect.soft(page).toHaveURL('/');

    // Should see dashboard content
    await expect
      .soft(page.getByRole('heading', {name: 'Dashboard'}))
      .toBeVisible();
  });

  test('should show error for invalid login credentials', async ({page}) => {
    await page.goto('/login');

    // Fill with invalid credentials
    await page.fill('#email', 'invalid@example.com');
    await page.fill('#password', 'wrongpassword');

    // Submit login
    await page.click('button[type="submit"]');

    // Should show error message
    await expect.soft(page.getByRole('alert').first()).toBeVisible();
    await expect.soft(page.getByText(/Login failed/i).first()).toBeVisible();

    // Should stay on login page
    await expect.soft(page).toHaveURL('/login');
  });

  test('should require username and password for registration', async ({
    page,
  }) => {
    await page.goto('/register');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Form should not submit (button should be disabled or form validation should prevent submission)
    await expect.soft(page).toHaveURL('/register');
  });

  test('should navigate between login and register pages', async ({page}) => {
    await page.goto('/login');

    // Go to register page
    await page.click('a[href="/register"]');
    await expect.soft(page).toHaveURL('/register');

    // Should be able to go back to login
    await page.goBack();
    await expect.soft(page).toHaveURL('/login');
  });
});
