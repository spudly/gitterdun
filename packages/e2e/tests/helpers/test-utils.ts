import type {Page} from '@playwright/test';
import {expect} from '@playwright/test';

export type UserCredentials = {username: string; password: string};

/**
 * Register and login a user with the given suffix
 */
export const registerAndLogin = async (
  page: Page,
  suffix = '',
): Promise<UserCredentials> => {
  const timestamp = Date.now() + Math.random();
  const username = `testuser${timestamp}${suffix}`;
  const password = 'testpassword123';

  await page.goto('/register');
  await page.fill('#username', username);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/');

  return {username, password};
};

/**
 * Login as an existing user
 */
export const loginAs = async (
  page: Page,
  username: string,
  password: string,
): Promise<void> => {
  await page.context().clearCookies();
  await page.goto('/login');
  await page.fill('#email', username);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/');
};

/**
 * Create a family setup with parent and child
 */
export const setupFamily = async (page: Page) => {
  const timestamp = Date.now() + Math.random();
  const parentUsername = `parent${timestamp}`;
  const parentPassword = 'parentpassword123';
  const childUsername = `child${timestamp}`;
  const childPassword = 'childpassword123';

  // Register parent user
  await page.goto('/register');
  await page.fill('#username', parentUsername);
  await page.fill('#password', parentPassword);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/');

  // Create family
  await page.goto('/family');
  const familyName = `Test Family ${timestamp}`;
  await page.fill('input[placeholder*="family name"]', familyName);
  await page.click('button:has-text("Create")');
  await expect(page.locator('text=Members')).toBeVisible();

  // Add child to family
  await page.fill('input#child-username', childUsername);
  await page.fill('input#child-password', childPassword);
  await page.click('button:has-text("Create Child")');
  await expect(page.locator(`text=${childUsername}`)).toBeVisible();

  return {
    parent: {username: parentUsername, password: parentPassword},
    child: {username: childUsername, password: childPassword},
    familyName,
  };
};

/**
 * Helper to add a child to an existing family
 */
const addChildToFamily = async (
  page: Page,
  username: string,
  password: string,
) => {
  await page.fill('input#child-username', username);
  await page.fill('input#child-password', password);
  await page.click('button:has-text("Create Child")');
  await expect(page.locator(`text=${username}`)).toBeVisible();
};

/**
 * Create a family setup with multiple children for leaderboard testing
 */
export const setupFamilyWithChildren = async (page: Page) => {
  const timestamp = Date.now() + Math.random();
  const parent = await registerAndLogin(page, `_parent_${timestamp}`);

  // Create family
  await page.goto('/family');
  const familyName = `Test Family ${timestamp}`;
  await page.fill('input[placeholder*="family name"]', familyName);
  await page.click('button:has-text("Create")');
  await expect(page.locator('text=Members')).toBeVisible();

  // Add children
  const child1Username = `child1_${timestamp}`;
  const child2Username = `child2_${timestamp}`;
  const childPassword = 'childpassword123';

  await addChildToFamily(page, child1Username, childPassword);
  await addChildToFamily(page, child2Username, childPassword);

  return {
    parent,
    child1: {username: child1Username, password: childPassword},
    child2: {username: child2Username, password: childPassword},
    familyName,
  };
};
