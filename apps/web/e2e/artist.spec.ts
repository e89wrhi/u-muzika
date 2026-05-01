import { test, expect } from '@playwright/test';

test.describe('Artist Page', () => {
  test('should navigate to an artist page from the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the artists to be loaded
    const firstArtistCard = page.locator('a[href^="/a/"]').first();
    await expect(firstArtistCard).toBeVisible();
    
    const artistName = await firstArtistCard.locator('h3').textContent();
    await firstArtistCard.click();
    
    // Check if the URL matches the pattern
    await expect(page).toHaveURL(/\/a\//);
    
    // Check if the artist name is present on the page
    if (artistName) {
      await expect(page.getByText(artistName, { exact: false }).first()).toBeVisible();
    }
  });

  test('should show artist videos and playlists', async ({ page }) => {
    // Navigate directly to Rophnan's page
    const rophnanId = 'UC2s9j9EMXMFklxGqDPJp-qQ';
    await page.goto(`/a/${rophnanId}`);
    
    // Check for "Videos" section or content
    // Based on ArtistClient, there should be some video cards
    await expect(page.getByText(/Videos/i).first()).toBeVisible();
    
    // Check for Playlists
    await expect(page.getByText(/Playlists/i).first()).toBeVisible();
  });
});
