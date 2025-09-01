import {test, expect} from './fixtures';
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

    // Should see the Full Rankings section header rendered by RankingList
    await expect
      .soft(page.getByRole('heading', {name: 'Full Rankings'}))
      .toBeVisible();
  });

  // Note: Additional test cases have been moved to leaderboard.skip.spec.ts
  // These tests are skipped because they require functionality not yet implemented in the app
});
