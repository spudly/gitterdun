import { test, expect } from '@playwright/test';

test('ProgressBar demo updates percent text when slider moves', async ({ page }) => {
  await page.goto('/__demos/ProgressBar');
  const demo = page.getByTestId('ProgressBarDemo');
  await expect(demo).toBeVisible();
  const slider = page.getByLabel('Progress');
  await slider.fill('75');
  await expect(page.getByText('75% Complete')).toBeVisible();
});

