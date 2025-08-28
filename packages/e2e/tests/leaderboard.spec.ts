import {test, expect} from '@playwright/test';
import {setupFamilyWithChildren} from './helpers/test-utils';

test.describe('leaderboard and Points System', () => {
  test('should display leaderboard page', async ({page}) => {
    // Set up family
    await setupFamilyWithChildren(page);

    // Navigate to leaderboard
    await page.goto('/leaderboard');
    await expect(page).toHaveURL('/leaderboard');

    // Should see leaderboard header
    await expect(page.getByText('Leaderboard')).toBeVisible();

    // Should see leaderboard content (RankingList component)
    await expect.soft(page.getByRole('list')).toBeVisible();
  });

  // Note: Additional test cases have been moved to leaderboard.skip.spec.ts
  // These tests are skipped because they require functionality not yet implemented in the app
});
