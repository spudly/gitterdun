import type {Page} from '@playwright/test';
import {expect} from '@playwright/test';

export type UserCredentials = {username: string; password: string};

export type FamilySetup = {
  parent: UserCredentials;
  child: UserCredentials;
  familyName: string;
};

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
export const setupFamily = async (page: Page): Promise<FamilySetup> => {
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
 * Create a family setup with multiple children for leaderboard testing
 */
export const setupFamilyWithChildren = async (page: Page) => {
  const timestamp = Date.now() + Math.random();
  const parentUsername = `parent${timestamp}`;
  const parentPassword = 'parentpassword123';

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

  // Add first child
  const child1Username = `child1_${timestamp}`;
  const child1Password = 'childpassword123';
  await page.fill('input#child-username', child1Username);
  await page.fill('input#child-password', child1Password);
  await page.click('button:has-text("Create Child")');
  await expect(page.locator(`text=${child1Username}`)).toBeVisible();

  // Add second child
  const child2Username = `child2_${timestamp}`;
  const child2Password = 'childpassword123';
  await page.fill('input#child-username', child2Username);
  await page.fill('input#child-password', child2Password);
  await page.click('button:has-text("Create Child")');
  await expect(page.locator(`text=${child2Username}`)).toBeVisible();

  return {
    parent: {username: parentUsername, password: parentPassword},
    child1: {username: child1Username, password: child1Password},
    child2: {username: child2Username, password: child2Password},
    familyName,
  };
};
