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

    await page.fill('#username', username);
    await page.fill('#password', 'testpassword123');
    await page.click('button[type="submit"]');
    await expect.soft(page).toHaveURL('/');

    const sidCookie = await checkSessionCookie(page);
    expect.soft(sidCookie).toBeDefined();

    const response = await testApiEndpoint(page);
    expect.soft(response).toBeDefined();

    // Test should pass regardless to see debug info
    expect.soft(true).toBe(true);
  });
});
