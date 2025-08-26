import { test, expect } from '@playwright/test';

test.describe('Leaderboard and Points System', () => {
  // Helper function to set up a family with multiple children
  const setupFamilyWithChildren = async (page: any) => {
    const timestamp = Date.now() + Math.random();
    const parentUsername = `parent${timestamp}`;
    const parentPassword = 'parentpassword123';
    
    // Register parent user
    await page.goto('/register');
    await page.fill('#username', parentUsername);
    await page.fill('#password', parentPassword);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
    
    // Create family
    await page.goto('/family');
    const familyName = `Test Family ${timestamp}`;
    await page.fill('input[placeholder*="family name"]', familyName);
    await page.click('button:has-text("Create")');
    await expect(page.locator('text=Members')).toBeVisible();
    
    // Add first child
    const child1Username = `child1_${timestamp}`;
    const child1Password = 'childpassword123';
    await page.fill('input#child-username', child1Username);
    await page.fill('input#child-password', child1Password);
    await page.click('button:has-text("Create Child")');
    await expect(page.locator(`text=${child1Username}`)).toBeVisible();
    
    // Add second child
    const child2Username = `child2_${timestamp}`;
    const child2Password = 'childpassword123';
    await page.fill('input#child-username', child2Username);
    await page.fill('input#child-password', child2Password);
    await page.click('button:has-text("Create Child")');
    await expect(page.locator(`text=${child2Username}`)).toBeVisible();
    
    return {
      parent: { username: parentUsername, password: parentPassword },
      child1: { username: child1Username, password: child1Password },
      child2: { username: child2Username, password: child2Password },
      familyName
    };
  };

  // Helper function to login as a specific user
  const loginAs = async (page: any, username: string, password: string) => {
    await page.context().clearCookies();
    await page.goto('/login');
    await page.fill('#email', username);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  };

  // Helper function to create and complete a chore
  const createAndCompleteChore = async (page: any, choreTitle: string, points: string, childUsername: string, parentUsername: string, parentPassword: string) => {
    // Create chore as parent
    await page.goto('/admin');
    await page.click('button:has-text("Create Chore")');
    await page.fill('input[placeholder*="title"]', choreTitle);
    await page.fill('input[type="number"]', points);
    await page.click('button:has-text("Create")');
    
         // Assign to child
     await page.locator(`text=${choreTitle}`).locator('..').locator('button:has-text("Assign")').click();
     await page.selectOption('select', childUsername);
     await page.click('button:has-text("Assign Chore")');
     
     // Login as child and complete
     await loginAs(page, childUsername, 'childpassword123');
     await page.goto('/chores');
     await page.locator(`text=${choreTitle}`).locator('..').locator('button:has-text("Complete")').click();
     
     // Login back as parent and approve
     await loginAs(page, parentUsername, parentPassword);
     await page.goto('/admin');
     await page.locator(`text=${choreTitle}`).locator('..').locator('button:has-text("Approve")').click();
   };

  test('should display leaderboard page', async ({ page }) => {
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

  test('should show family members on leaderboard', async ({ page }) => {
    // Set up family
    const { child1, child2 } = await setupFamilyWithChildren(page);
    
    // Navigate to leaderboard
    await page.goto('/leaderboard');
    
    // Should see family members listed
    await expect(page.locator(`text=${child1.username}`)).toBeVisible();
    await expect(page.locator(`text=${child2.username}`)).toBeVisible();
  });

  test('should track points from completed chores', async ({ page }) => {
    // Set up family
    const { parent, child1 } = await setupFamilyWithChildren(page);
    
    // Create and complete a chore worth 20 points
    const choreTitle = `Points Chore ${Date.now()}`;
    await createAndCompleteChore(page, choreTitle, '20', child1.username, parent.username, parent.password);
    
    // Navigate to leaderboard
    await page.goto('/leaderboard');
    
    // Should see child with 20 points
    await expect(page.locator(`text=${child1.username}`)).toBeVisible();
    await expect(page.locator('text=20')).toBeVisible(); // Points display
  });

  test('should rank children by points correctly', async ({ page }) => {
    // Set up family
    const { parent, child1, child2 } = await setupFamilyWithChildren(page);
    
    // Give child1 more points than child2
    await createAndCompleteChore(page, `High Points ${Date.now()}`, '30', child1.username, parent.username, parent.password);
    await createAndCompleteChore(page, `Low Points ${Date.now()}`, '10', child2.username, parent.username, parent.password);
    
    // Navigate to leaderboard
    await page.goto('/leaderboard');
    
    // Child1 should be ranked higher than child2
    const leaderboard = page.locator('[data-testid="leaderboard"]');
    
    // Check the visual order - child1 should appear before child2 (higher rank)
    const allMembers = await leaderboard.locator('[data-testid="leaderboard-member"]').all();
    const memberTexts = await Promise.all(allMembers.map(member => member.textContent()));
    
    const child1Index = memberTexts.findIndex(text => text?.includes(child1.username));
    const child2Index = memberTexts.findIndex(text => text?.includes(child2.username));
    
    // Child1 should appear before child2 (lower index = higher rank)
    expect(child1Index).toBeLessThan(child2Index);
  });

  test('should show cumulative points from multiple chores', async ({ page }) => {
    // Set up family
    const { parent, child1 } = await setupFamilyWithChildren(page);
    
    // Complete multiple chores
    await createAndCompleteChore(page, `Chore 1 ${Date.now()}`, '15', child1.username, parent.username, parent.password);
    await createAndCompleteChore(page, `Chore 2 ${Date.now()}`, '25', child1.username, parent.username, parent.password);
    
    // Navigate to leaderboard
    await page.goto('/leaderboard');
    
    // Should see child with total points (15 + 25 = 40)
    await expect(page.locator(`text=${child1.username}`)).toBeVisible();
    await expect(page.locator('text=40')).toBeVisible();
  });

  test('should update leaderboard when new chores are completed', async ({ page }) => {
    // Set up family
    const { parent, child1 } = await setupFamilyWithChildren(page);
    
    // Navigate to leaderboard first (should show 0 points)
    await page.goto('/leaderboard');
    await expect(page.locator(`text=${child1.username}`)).toBeVisible();
    
    // Complete a chore
    await createAndCompleteChore(page, `New Chore ${Date.now()}`, '50', child1.username, parent.username, parent.password);
    
    // Return to leaderboard
    await page.goto('/leaderboard');
    
    // Should see updated points
    await expect(page.locator('text=50')).toBeVisible();
  });

  test('should show leaderboard even with no completed chores', async ({ page }) => {
    // Set up family
    const { child1, child2 } = await setupFamilyWithChildren(page);
    
    // Navigate to leaderboard without completing any chores
    await page.goto('/leaderboard');
    
    // Should still show family members with 0 points
    await expect(page.locator(`text=${child1.username}`)).toBeVisible();
    await expect(page.locator(`text=${child2.username}`)).toBeVisible();
  });

  test('should handle bonus points correctly', async ({ page }) => {
    // Set up family
    const { parent, child1 } = await setupFamilyWithChildren(page);
    
    // Create a chore with bonus points
    await page.goto('/admin');
    const choreTitle = `Bonus Chore ${Date.now()}`;
    await page.click('button:has-text("Create Chore")');
    await page.fill('input[placeholder*="title"]', choreTitle);
    await page.fill('input[type="number"]', '10'); // Base points
    
    // Add bonus points if the UI supports it
    // This might need adjustment based on actual form structure
    const bonusInput = page.locator('input[placeholder*="bonus"]');
    if (await bonusInput.count() > 0) {
      await bonusInput.fill('5');
    }
    
    await page.click('button:has-text("Create")');
    
    // Assign and complete the chore
    await page.locator(`text=${choreTitle}`).locator('..').locator('button:has-text("Assign")').click();
    await page.selectOption('select', child1.username);
    await page.click('button:has-text("Assign Chore")');
    
    await loginAs(page, child1.username, 'childpassword123');
    await page.goto('/chores');
    await page.locator(`text=${choreTitle}`).locator('..').locator('button:has-text("Complete")').click();
    
    await loginAs(page, parent.username, parent.password);
    await page.goto('/admin');
    await page.locator(`text=${choreTitle}`).locator('..').locator('button:has-text("Approve")').click();
    
    // Check leaderboard for total points (10 + 5 = 15)
    await page.goto('/leaderboard');
    await expect(page.locator('text=15')).toBeVisible();
  });

  test('should allow navigation between pages while maintaining leaderboard state', async ({ page }) => {
    // Set up family
    const { parent, child1 } = await setupFamilyWithChildren(page);
    
    // Complete a chore
    await createAndCompleteChore(page, `Nav Test ${Date.now()}`, '35', child1.username, parent.username, parent.password);
    
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