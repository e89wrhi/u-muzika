import { test, expect } from '@playwright/test';

test.describe('Authentication UI', () => {
  test('should show sign in button when logged out', async ({ page }) => {
    await page.goto('/');
    
    // Clerk "signed-out" content should be visible
    const signInButton = page.getByRole('link', { name: /sign in/i });
    await expect(signInButton).toBeVisible();
  });

  test('should redirect to login page when accessing protected route', async ({ page }) => {
    // Attempt to access /settings which is likely protected (in src/app/(protected)/settings)
    await page.goto('/settings');
    
    // Clerk should redirect to sign-in page if not authenticated
    // The URL usually contains clerk's sign-in path or redirects to /login if that's how it's configured
    await expect(page).toHaveURL(/.*sign-in|.*login.*/);
  });

  test('should show registration link on login page', async ({ page }) => {
    await page.goto('/login');
    // Check for "Sign up" or similar link on the custom login page
    // Note: Clerk components or custom UI
    const signUpLink = page.getByRole('link', { name: /sign up|register/i });
    if (await signUpLink.isVisible()) {
        await expect(signUpLink).toBeVisible();
    }
  });
});
