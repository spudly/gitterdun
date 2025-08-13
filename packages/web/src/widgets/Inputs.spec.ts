import {test, expect} from '@playwright/test';

test('TextInput and SelectInput demos render and interact', async ({page}) => {
  await page.goto('/__demos/TextInput');
  const email = page.getByLabel('Email');
  await expect(email).toBeVisible();
  await email.fill('a@example.com');
  await page.goto('/__demos/SelectInput');
  const role = page.getByLabel('Role');
  await expect(role).toBeVisible();
  await role.selectOption('child');
});
