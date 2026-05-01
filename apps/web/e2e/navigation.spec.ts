import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
    // Check if the logo is visible
    await expect(page.getByAltText('Muzika Logo')).toBeVisible();
    // Check if "U Muzika" text is present
    await expect(page.getByText('U Muzika', { exact: true })).toBeVisible();
  });

  test('should navigate to "How it Works" page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=How it Works');
    await expect(page).toHaveURL('/how');
    // Assuming there's a heading in the "How it Works" page
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should have a working sign in link', async ({ page }) => {
    await page.goto('/');
    const signInLink = page.getByRole('link', { name: /sign in/i });
    await expect(signInLink).toBeVisible();
    await signInLink.click();
    await expect(page).toHaveURL(/\/login/);
  });
});
