import type {Page} from '@playwright/test';
import {test, expect} from '@playwright/test';
import type {UserCredentials} from './helpers/test-utils';
import {setupFamilyWithChildren, loginAs} from './helpers/test-utils';

test.describe('Leaderboard and Points System', () => {
  type ChoreTestData = {
    choreTitle: string;
    points: string;
    childUsername: string;
    parent: UserCredentials;
  };

  // Helper function to create and complete a chore
  const createAndCompleteChore = async (page: Page, data: ChoreTestData) => {
    // Create and assign chore as parent
    await page.goto('/admin');
    await page.click('button:has-text("Create Chore")');
    await page.fill('input[placeholder*="title"]', data.choreTitle);
    await page.fill('input[type="number"]', data.points);
    await page.click('button:has-text("Create")');

    // Assign to child
    await page
      .locator(`text=${data.choreTitle}`)
      .locator('..')
      .locator('button:has-text("Assign")')
      .click();
    await page.selectOption('select', data.childUsername);
    await page.click('button:has-text("Assign Chore")');

    // Complete as child
    await loginAs(page, data.childUsername, 'childpassword123');
    await page.goto('/chores');
    await page
      .locator(`text=${data.choreTitle}`)
      .locator('..')
      .locator('button:has-text("Complete")')
      .click();

    // Approve as parent
    await loginAs(page, data.parent.username, data.parent.password);
    await page.goto('/admin');
    await page
      .locator(`text=${data.choreTitle}`)
      .locator('..')
      .locator('button:has-text("Approve")')
      .click();
  };

  test('should display leaderboard page', async ({page}) => {
    // Set up family
    await setupFamilyWithChildren(page);

    // Navigate to leaderboard
    await page.goto('/leaderboard');
    await expect(page).toHaveURL('/leaderboard');

    // Should see leaderboard header
    await expect(page.locator('text=Leaderboard')).toBeVisible();

    // Should see leaderboard content (even if empty)
    await expect(page.locator('[data-testid="leaderboard"]')).toBeVisible();
  });

  test('should show family members on leaderboard', async ({page}) => {
    // Set up family
    const {child1, child2} = await setupFamilyWithChildren(page);

    // Navigate to leaderboard
    await page.goto('/leaderboard');

    // Should see family members listed
    await expect(page.locator(`text=${child1.username}`)).toBeVisible();
    await expect(page.locator(`text=${child2.username}`)).toBeVisible();
  });

  test('should track points from completed chores', async ({page}) => {
    // Set up family
    const {parent, child1} = await setupFamilyWithChildren(page);

    // Create and complete a chore worth 20 points
    const choreTitle = `Points Chore ${Date.now()}`;
    await createAndCompleteChore(page, {
      choreTitle,
      points: '20',
      childUsername: child1.username,
      parent,
    });

    // Navigate to leaderboard
    await page.goto('/leaderboard');

    // Should see child with 20 points
    await expect(page.locator(`text=${child1.username}`)).toBeVisible();
    await expect(page.locator('text=20')).toBeVisible(); // Points display
  });

  test('should rank children by points correctly', async ({page}) => {
    // Set up family
    const {parent, child1, child2} = await setupFamilyWithChildren(page);

    // Give child1 more points than child2
    await createAndCompleteChore(page, {
      choreTitle: `High Points ${Date.now()}`,
      points: '30',
      childUsername: child1.username,
      parent,
    });
    await createAndCompleteChore(page, {
      choreTitle: `Low Points ${Date.now()}`,
      points: '10',
      childUsername: child2.username,
      parent,
    });

    // Navigate to leaderboard
    await page.goto('/leaderboard');

    // Child1 should be ranked higher than child2
    const leaderboard = page.locator('[data-testid="leaderboard"]');

    // Check the visual order - child1 should appear before child2 (higher rank)
    const allMembers = await leaderboard
      .locator('[data-testid="leaderboard-member"]')
      .all();
    const memberTexts = await Promise.all(
      allMembers.map(async member => member.textContent()),
    );

    const child1Index = memberTexts.findIndex(text =>
      Boolean(text?.includes(child1.username)),
    );
    const child2Index = memberTexts.findIndex(text =>
      Boolean(text?.includes(child2.username)),
    );

    // Child1 should appear before child2 (lower index = higher rank)
    expect(child1Index).toBeLessThan(child2Index);
  });

  test('should show cumulative points from multiple chores', async ({page}) => {
    // Set up family
    const {parent, child1} = await setupFamilyWithChildren(page);

    // Complete multiple chores
    await createAndCompleteChore(page, {
      choreTitle: `Chore 1 ${Date.now()}`,
      points: '15',
      childUsername: child1.username,
      parent,
    });
    await createAndCompleteChore(page, {
      choreTitle: `Chore 2 ${Date.now()}`,
      points: '25',
      childUsername: child1.username,
      parent,
    });

    // Navigate to leaderboard
    await page.goto('/leaderboard');

    // Should see child with total points (15 + 25 = 40)
    await expect(page.locator(`text=${child1.username}`)).toBeVisible();
    await expect(page.locator('text=40')).toBeVisible();
  });

  test('should update leaderboard when new chores are completed', async ({
    page,
  }) => {
    // Set up family
    const {parent, child1} = await setupFamilyWithChildren(page);

    // Navigate to leaderboard first (should show 0 points)
    await page.goto('/leaderboard');
    await expect(page.locator(`text=${child1.username}`)).toBeVisible();

    // Complete a chore
    await createAndCompleteChore(page, {
      choreTitle: `New Chore ${Date.now()}`,
      points: '50',
      childUsername: child1.username,
      parent,
    });

    // Return to leaderboard
    await page.goto('/leaderboard');

    // Should see updated points
    await expect(page.locator('text=50')).toBeVisible();
  });

  test('should show leaderboard even with no completed chores', async ({
    page,
  }) => {
    // Set up family
    const {child1, child2} = await setupFamilyWithChildren(page);

    // Navigate to leaderboard without completing any chores
    await page.goto('/leaderboard');

    // Should still show family members with 0 points
    await expect(page.locator(`text=${child1.username}`)).toBeVisible();
    await expect(page.locator(`text=${child2.username}`)).toBeVisible();
  });

  test('should handle bonus points correctly', async ({page}) => {
    // Set up family
    const {parent, child1} = await setupFamilyWithChildren(page);

    // Create a chore with bonus points
    await page.goto('/admin');
    const choreTitle = `Bonus Chore ${Date.now()}`;
    await page.click('button:has-text("Create Chore")');
    await page.fill('input[placeholder*="title"]', choreTitle);
    await page.fill('input[type="number"]', '10'); // Base points

    // Add bonus points if the UI supports it
    // This might need adjustment based on actual form structure
    const bonusInput = page.locator('input[placeholder*="bonus"]');
    if ((await bonusInput.count()) > 0) {
      await bonusInput.fill('5');
    }

    await page.click('button:has-text("Create")');

    // Assign and complete the chore
    await page
      .locator(`text=${choreTitle}`)
      .locator('..')
      .locator('button:has-text("Assign")')
      .click();
    await page.selectOption('select', child1.username);
    await page.click('button:has-text("Assign Chore")');

    await loginAs(page, child1.username, 'childpassword123');
    await page.goto('/chores');
    await page
      .locator(`text=${choreTitle}`)
      .locator('..')
      .locator('button:has-text("Complete")')
      .click();

    await loginAs(page, parent.username, parent.password);
    await page.goto('/admin');
    await page
      .locator(`text=${choreTitle}`)
      .locator('..')
      .locator('button:has-text("Approve")')
      .click();

    // Check leaderboard for total points (10 + 5 = 15)
    await page.goto('/leaderboard');
    await expect(page.locator('text=15')).toBeVisible();
  });

  test('should allow navigation between pages while maintaining leaderboard state', async ({
    page,
  }) => {
    // Set up family
    const {parent, child1} = await setupFamilyWithChildren(page);

    // Complete a chore
    await createAndCompleteChore(page, {
      choreTitle: `Nav Test ${Date.now()}`,
      points: '35',
      childUsername: child1.username,
      parent,
    });

    // Visit leaderboard
    await page.goto('/leaderboard');
    await expect(page.locator('text=35')).toBeVisible();

    // Navigate to other pages and back
    await page.goto('/dashboard');
    await page.goto('/chores');
    await page.goto('/leaderboard');

    // Points should still be visible
    await expect(page.locator('text=35')).toBeVisible();
  });
});
