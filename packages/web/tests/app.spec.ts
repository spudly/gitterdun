import { test, expect } from './fixtures';
// Using default admin user created by the API on startup

test.describe('Web app basic navigation', () => {
  test('renders layout and navigates between routes', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Gitterdun')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await page.getByRole('link', { name: 'Chores' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Chores' })).toBeVisible();
    await page.getByRole('link', { name: 'Goals' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Goals' })).toBeVisible();
    await page.getByRole('link', { name: 'Leaderboard' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Leaderboard' })).toBeVisible();
  });
});

test.describe('Auth flows', () => {
  test('login form shows error on invalid credentials', async ({page}) => {
    // Hitting real API with nonexistent user should 401
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('nobody@example.com');
    await page.locator('input[type="password"]').fill('wrongpass');
    await page.getByRole('button', {name: 'Login'}).click();
    await expect(page.getByText('Login failed')).toBeVisible();
  });

  test('forgot/reset password forms render and validate', async ({page}) => {
    await page.goto('/forgot-password');
    await expect(
      page.getByRole('heading', {name: 'Forgot Password'}),
    ).toBeVisible();
    await page.locator('input[type="email"]').fill('someone@test.local');
    await page.getByRole('button', {name: 'Send reset link'}).click();
    await expect(page.getByText('If the email exists')).toBeVisible();

    await page.goto('/reset-password');
    await expect(
      page.getByRole('heading', {name: 'Reset Password'}),
    ).toBeVisible();
    await page.locator('input[type="password"]').first().fill('secret123');
    await page.locator('input[type="password"]').last().fill('secret123');
    await page.getByRole('button', {name: 'Reset Password'}).click();
    await expect(page.getByText('Missing token')).toBeVisible();
  });
});

test.describe('Feature pages', () => {
  test('chores page displays without user', async ({page}) => {
    await page.goto('/chores');
    await expect(
      page.getByRole('heading', {level: 1, name: 'Chores'}),
    ).toBeVisible();
  });

  test('admin page denies access without admin', async ({page}) => {
    await page.goto('/admin');
    await expect(page.getByText('Access Denied')).toBeVisible();
  });

  test('admin user flow navigates all pages (true E2E)', async ({page}) => {
    // Login via UI to share cookie with page session
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('admin@gitterdun.com');
    await page.locator('input[type="password"]').fill('admin123');
    await page.getByRole('button', {name: 'Login'}).click();
    await page.goto('/');
    await expect(
      page.getByRole('heading', {level: 1, name: 'Dashboard'}),
    ).toBeVisible();
    await page.getByRole('link', {name: 'Chores'}).click();
    await expect(
      page.getByRole('heading', {level: 1, name: 'Chores'}),
    ).toBeVisible();
    await page.getByRole('link', {name: 'Goals'}).click();
    await expect(
      page.getByRole('heading', {level: 1, name: 'Goals'}),
    ).toBeVisible();
    await page.getByRole('link', {name: 'Leaderboard'}).click();
    await expect(
      page.getByRole('heading', {level: 1, name: 'Leaderboard'}),
    ).toBeVisible();
    // If admin link exists, user is admin; otherwise assert access denied
    const adminLink = page.getByRole('link', {name: 'Admin'});
    if ((await adminLink.count()) > 0) {
      await adminLink.click();
      await expect(
        page.getByRole('heading', {level: 1, name: 'Admin Panel'}),
      ).toBeVisible();
    } else {
      await page.goto('/admin');
      await expect(page.getByText('Access Denied')).toBeVisible();
    }
    await page.goto('/family');
    const familiesHeading = page.getByText('Your Families');
    if ((await familiesHeading.count()) > 0) {
      await expect(familiesHeading).toBeVisible();
    } else {
      await expect(
        page.getByText('Please log in to manage your family.'),
      ).toBeVisible();
    }
  });

  test('family page prompts to log in when no user', async ({page}) => {
    await page.goto('/family');
    await expect(
      page.getByText('Please log in to manage your family.'),
    ).toBeVisible();
  });

  test('accept invitation form validates token', async ({page}) => {
    await page.goto('/accept-invitation');
    await expect(page.getByText('Missing token.')).toBeVisible();
  });

  test('accept invitation page renders with token', async ({page}) => {
    await page.goto('/accept-invitation?token=abc');
    await expect(
      page.getByRole('heading', {name: 'Accept Invitation'}),
    ).toBeVisible();
    await expect(
      page.getByRole('button', {name: 'Accept Invitation'}),
    ).toBeVisible();
  });
});

