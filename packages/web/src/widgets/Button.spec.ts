import {test, expect} from '@playwright/test';

test.describe('Button demo', () => {
  test('renders variants and toggles loading', async ({page}) => {
    await page.goto('/__demos/Button');
    await expect(page.getByTestId('ButtonDemo')).toBeVisible();
    await expect(page.getByRole('button', {name: 'Default'})).toBeVisible();
    await expect(page.getByRole('button', {name: 'Secondary'})).toBeVisible();
    await expect(page.getByRole('button', {name: 'Danger'})).toBeVisible();
    await expect(page.getByRole('button', {name: 'Ghost'})).toBeVisible();

    const toggle = page.getByRole('button', {name: 'Toggle Loading'});
    await toggle.click();
    await expect(toggle).toBeDisabled();
    await toggle.click({force: true});
  });

  test('fullWidth and size variants render correctly', async ({page}) => {
    await page.goto('/__demos/Button');
    await expect(page.getByRole('button', {name: 'Full width'})).toBeVisible();
    await expect(page.getByRole('button', {name: 'Small'})).toBeVisible();
    await expect(page.getByRole('button', {name: 'Medium'})).toBeVisible();
    await expect(page.getByRole('button', {name: 'Large'})).toBeVisible();
  });
});
