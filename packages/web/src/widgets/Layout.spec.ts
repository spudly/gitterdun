import {test, expect} from '@playwright/test';

test('Layout demo renders and shows navigation', async ({page}) => {
  await page.goto('/__demos/Layout');
  const demo = page.getByTestId('LayoutDemo');
  await expect(demo).toBeVisible();
  await expect(demo.getByRole('link', {name: 'Dashboard'})).toBeVisible();
  await expect(demo.getByRole('link', {name: 'Chores'})).toBeVisible();
});
