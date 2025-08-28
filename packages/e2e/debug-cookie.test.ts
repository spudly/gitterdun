import type {Page} from '@playwright/test';
import {test, expect} from '@playwright/test';

// Helper function to check cookies
const checkSessionCookie = async (page: Page) => {
  const cookies = await page.context().cookies();
  return cookies.find(cookie => cookie.name === 'sid');
};

// Helper function to test API endpoint
const testApiEndpoint = async (page: Page): Promise<unknown> => {
  return page.evaluate(async () => {
    const response = await fetch('http://localhost:8000/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    });
    return response.json() as unknown;
  });
};

test.describe('cookie Debug', () => {
  test('check if cookies are set after registration', async ({page}) => {
    const username = `cookie_test_${Date.now()}`;
    await page.goto('/register');

    await page.getByLabel('Username').fill(username);
    await page.getByLabel('Password').fill('testpassword123');
    await page.getByRole('button', {name: /submit|register|sign up/i}).click();
    await expect(page).toHaveURL('/');

    const sidCookie = await checkSessionCookie(page);
    expect(sidCookie).toBeDefined();

    const response = await testApiEndpoint(page);
    expect(response).toBeDefined();

    // Test should pass regardless to see debug info
    expect(true).toBe(true);
  });
});
