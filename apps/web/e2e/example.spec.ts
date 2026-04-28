import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/U Muzika/);
});

test('get started link', async ({ page }) => {
  await page.goto('/');
});
