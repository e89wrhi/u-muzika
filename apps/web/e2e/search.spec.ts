import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test('should allow searching from the navbar', async ({ page }) => {
    await page.goto('/');
    
    // Fill the search input
    const searchInput = page.getByPlaceholder(/Search artists, tracks/i);
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Bob Marley');
    await searchInput.press('Enter');
    
    // Check if the URL changed to include the search query
    // Based on the code, it redirects to /v?q=Bob%20Marley
    // Note: This might be a 404 in the current implementation, but we test the intent
    await expect(page).toHaveURL(/\/v\?q=Bob%20Marley/);
  });

  test('should clear search input when "X" is clicked', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByPlaceholder(/Search artists, tracks/i);
    await searchInput.fill('Test Search');
    
    const clearButton = page.locator('button:has-text("×")');
    await clearButton.click();
    
    await expect(searchInput).toHaveValue('');
  });
});
