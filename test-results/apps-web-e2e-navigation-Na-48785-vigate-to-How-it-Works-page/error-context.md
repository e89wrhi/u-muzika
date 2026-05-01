# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apps\web\e2e\navigation.spec.ts >> Navigation >> should navigate to "How it Works" page
- Location: apps\web\e2e\navigation.spec.ts:13:3

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Navigation', () => {
  4  |   test('should navigate to the homepage', async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await expect(page).toHaveURL('/');
  7  |     // Check if the logo is visible
  8  |     await expect(page.getByAltText('Muzika Logo')).toBeVisible();
  9  |     // Check if "U Muzika" text is present
  10 |     await expect(page.getByText('U Muzika', { exact: true })).toBeVisible();
  11 |   });
  12 | 
  13 |   test('should navigate to "How it Works" page', async ({ page }) => {
> 14 |     await page.goto('/');
     |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  15 |     await page.click('text=How it Works');
  16 |     await expect(page).toHaveURL('/how');
  17 |     // Assuming there's a heading in the "How it Works" page
  18 |     await expect(page.locator('h1')).toBeVisible();
  19 |   });
  20 | 
  21 |   test('should have a working sign in link', async ({ page }) => {
  22 |     await page.goto('/');
  23 |     const signInLink = page.getByRole('link', { name: /sign in/i });
  24 |     await expect(signInLink).toBeVisible();
  25 |     await signInLink.click();
  26 |     await expect(page).toHaveURL(/\/login/);
  27 |   });
  28 | });
  29 | 
```