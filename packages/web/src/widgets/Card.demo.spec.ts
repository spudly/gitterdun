import { test, expect } from '@playwright/test';

test('Card demo renders header, footer, and flat variants', async ({ page }) => {
  await page.goto('/__demos/Card');
  const demo = page.getByTestId('CardDemo');
  await expect(demo).toBeVisible();
  await expect(page.getByText('Simple card')).toBeVisible();
  await expect(page.getByText('Header', { exact: true })).toBeVisible();
  await expect(page.getByText('With header', { exact: true })).toBeVisible();
  await expect(page.getByText('Footer', { exact: true })).toBeVisible();
  await expect(page.getByText('With footer')).toBeVisible();
  await expect(page.getByText('Bordered (flat)')).toBeVisible();
});

