import type {Page} from '@playwright/test';
import {expect} from '@playwright/test';

type UserCredentials = {username: string; password: string};

const generateShortId = (): string =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const buildUsername = (prefix: string, suffix = '', maxLength = 50): string => {
  const id = generateShortId();
  const base = `${prefix}_${id}`;
  const candidate = `${base}${suffix}`;
  return candidate.length > maxLength
    ? candidate.slice(0, maxLength)
    : candidate;
};

/**
 * Register and login a user with the given suffix
 */
export const registerAndLogin = async (
  page: Page,
  suffix = '',
): Promise<UserCredentials> => {
  const username = buildUsername('tu', suffix);
  const password = 'testpassword123';

  await page.goto('/register');
  const usernameInput = page.getByRole('textbox', {name: 'Username'});
  const passwordInput = page.getByRole('textbox', {name: 'Password'});
  const submitButton = page.getByRole('button', {name: 'Register'});

  await usernameInput.fill(username);
  await passwordInput.fill(password);
  await expect(submitButton).toBeEnabled();
  await submitButton.click();
  await expect(page).toHaveURL('/');

  return {username, password};
};

/**
 * Login as an existing user
 */
// Intentionally not exported to satisfy knip
const loginAs = async (
  page: Page,
  username: string,
  password: string,
): Promise<void> => {
  await page.context().clearCookies();
  await page.goto('/login');
  const usernameInput = page.getByRole('textbox', {name: 'Username or Email'});
  const passwordInput = page.getByRole('textbox', {name: 'Password'});
  const submitButton = page.getByRole('button', {name: 'Login'});

  await usernameInput.fill(username);
  await passwordInput.fill(password);
  await expect(submitButton).toBeEnabled();
  await submitButton.click();
  await expect(page).toHaveURL('/');
};

/**
 * Ensure admin user has a family and wait for create child form to be visible
 */
const ensureFamilyExists = async (page: Page): Promise<void> => {
  const createFamilyButton = page.getByRole('button', {name: 'Create'});
  const createFamilyInput = page.getByPlaceholder('New family name');

  // If there's no family, create one
  if (await createFamilyInput.isVisible()) {
    await createFamilyInput.fill('Test Family');
    await expect(createFamilyButton).toBeEnabled();
    await createFamilyButton.click();

    // Wait for the family creation to complete and form to update
    await expect(page.getByText('Create Child Account')).toBeVisible({
      timeout: 15000,
    });
  } else {
    // Wait for the existing family to load and the create child form to be visible
    // The form only appears when a family is selected, so we need to wait for it
    await expect(page.getByText('Create Child Account')).toBeVisible({
      timeout: 10000,
    });
  }
};

/**
 * Create a family setup with parent and child
 */
export const setupFamily = async (page: Page) => {
  const id = generateShortId();
  const childUsername = `c_${id}`;
  const childEmail = `${childUsername}@example.com`;
  const childPassword = 'childpassword123';

  // Login as admin user (which already exists)
  await page.goto('/login');
  const usernameInput = page.getByRole('textbox', {name: 'Username or Email'});
  const passwordInput = page.getByRole('textbox', {name: 'Password'});
  const submitButton = page.getByRole('button', {name: 'Login'});

  await usernameInput.fill('admin');
  await passwordInput.fill('admin123');
  await expect(submitButton).toBeEnabled();
  await submitButton.click();
  await expect(page).toHaveURL('/');

  // Navigate to family page and ensure family exists
  await page.goto('/family');
  await expect(page.getByRole('heading', {name: 'Your Family'})).toBeVisible();
  await ensureFamilyExists(page);

  const familyName = `Test Family`; // Use created or existing family

  // Add child to family: scope to the Create Child section and fill all required fields
  const createChildSection = page.getByRole('region', {
    name: 'Create Child Account',
  });
  await createChildSection.getByPlaceholder('Username').fill(childUsername);
  await createChildSection.getByPlaceholder('Email').fill(childEmail);
  await createChildSection.getByPlaceholder('Password').fill(childPassword);
  await createChildSection.getByRole('button', {name: 'Create'}).click();
  await expect(page.getByText(childUsername)).toBeVisible({timeout: 15000});

  return {
    parent: {username: 'admin', password: 'admin123'},
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
  // Target the Create Child section specifically to avoid conflicts with invite form
  const section = page.getByRole('region', {name: 'Create Child Account'});
  await section.getByPlaceholder('Username').fill(username);
  await section.getByPlaceholder('Email').fill(`${username}@example.com`);
  await section.getByPlaceholder('Password').fill(password);
  await section.getByRole('button', {name: 'Create'}).click();
  await expect(page.getByText(username)).toBeVisible({timeout: 15000});
};

/**
 * Create a family setup with multiple children for leaderboard testing
 */
export const setupFamilyWithChildren = async (page: Page) => {
  const id = generateShortId();
  // Login as admin user and create a family with two children so we can manage chores
  await page.goto('/login');
  const usernameInput = page.getByRole('textbox', {name: 'Username or Email'});
  const passwordInput = page.getByRole('textbox', {name: 'Password'});
  const submitButton = page.getByRole('button', {name: 'Login'});
  await usernameInput.fill('admin');
  await passwordInput.fill('admin123');
  await expect(submitButton).toBeEnabled();
  await submitButton.click();
  await expect(page).toHaveURL('/');

  await page.goto('/family');
  await expect(page.getByRole('heading', {name: 'Your Family'})).toBeVisible();
  // Ensure a family exists (create if needed), then Members section should be visible
  await ensureFamilyExists(page);
  const familyName = `Test Family ${id}`; // for return consistency only
  const child1Username = `c1_${id}`;
  const child2Username = `c2_${id}`;
  const childPassword = 'childpassword123';

  await addChildToFamily(page, child1Username, childPassword);
  await addChildToFamily(page, child2Username, childPassword);

  return {
    parent: {username: 'admin', password: 'admin123'},
    child1: {username: child1Username, password: childPassword},
    child2: {username: child2Username, password: childPassword},
    familyName,
  };
};
