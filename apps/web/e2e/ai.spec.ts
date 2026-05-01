import { test, expect } from '@playwright/test';

test.describe('AI Features', () => {
  test('should redirect to login when clicking "Talk with AI" while logged out', async ({ page }) => {
    // Navigate to a video page (using a known ID or finding one from artist page)
    // For this test, we can try navigating to a specific video if we have an ID
    // or just navigate to an artist page and click a video.
    
    await page.goto('/');
    const firstArtistCard = page.locator('a[href^="/a/"]').first();
    await firstArtistCard.click();
    
    // Wait for the videos to load and click the first one
    const firstVideoLink = page.locator('a[href^="/v/"]').first();
    await expect(firstVideoLink).toBeVisible();
    await firstVideoLink.click();
    
    // Check if the "Talk with AI" button exists
    const talkWithAIButton = page.getByRole('link', { name: /talk with ai/i });
    await expect(talkWithAIButton).toBeVisible();
    
    // Click it
    await talkWithAIButton.click();
    
    // Should be redirected to login
    await expect(page).toHaveURL(/.*sign-in|.*login.*/);
  });
});
