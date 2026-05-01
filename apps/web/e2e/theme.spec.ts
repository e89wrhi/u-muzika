import { test, expect } from '@playwright/test';

test.describe('Theme Switcher', () => {
  test('should toggle between light and dark mode', async ({ page }) => {
    await page.goto('/');
    
    // Get the initial theme (it should be light or dark based on system, but usually defaults to light or dark)
    const html = page.locator('html');
    
    // Find the theme toggle button in the navbar
    // Note: The navbar has a theme toggle button
    const themeButton = page.locator('header').getByRole('button').filter({ has: page.locator('svg.lucide-sun, svg.lucide-moon') });
    
    await expect(themeButton).toBeVisible();
    
    const initialClass = await html.getAttribute('class');
    const isInitiallyDark = initialClass?.includes('dark');
    
    await themeButton.click();
    
    // Check if the theme changed
    const newClass = await html.getAttribute('class');
    if (isInitiallyDark) {
      expect(newClass).not.toContain('dark');
    } else {
      expect(newClass).toContain('dark');
    }
    
    // Toggle back
    await themeButton.click();
    const finalClass = await html.getAttribute('class');
    if (isInitiallyDark) {
      expect(finalClass).toContain('dark');
    } else {
      expect(finalClass).not.toContain('dark');
    }
  });
});
