import {test, expect} from '@playwright/test';

test('leaderboard renders headings and full rankings', async ({page}) => {
  await page.goto('/leaderboard');
  await expect(
    page.getByRole('heading', {level: 1, name: 'Leaderboard'}),
  ).toBeVisible();
  await expect(page.getByText('Full Rankings')).toBeVisible();
});
