import { test, expect } from '@playwright/test';

/**
 * Tests for the municipality detail pages (/malmo, /lund).
 *
 * kommuner.spec.ts covers the overview page and the routing. This file covers
 * what those tests explicitly leave out: the content of the detail pages, and
 * whether data actually reaches them.
 *
 * Adjust MAIN below if the page content sits in something other than <main>.
 */

const MAIN = 'main';

/**
 * Test 1: The Malmö page loads on direct navigation.
 * Goes straight to /malmo and checks that the page renders with the
 * municipality name as a heading, instead of an empty page or an error.
 * Pass: the route works without going through the menu first.
 * Fail: the route is missing in App.tsx, or the page renders without a heading.
 * Note: navigating directly is deliberate. A route can work through the menu
 * and still break on reload or on a shared link.
 */
test('Malmö-sidan laddar och visar kommunens namn', async ({ page }) => {
  await page.goto('/malmo');

  await expect(
    page.getByRole('heading', { name: /Malmö/ })
  ).toBeVisible();
});

/**
 * Test 2: The Malmö page renders data, not just a layout.
 * Checks that the main content contains at least one numeric value, which
 * means data has travelled from the database through the API to the page.
 * Pass: the data path works end to end.
 * Fail: the API is down, returns nothing, or the page renders an empty shell.
 * Note: the test does not check that the values are correct, only that values
 * are rendered. A page of empty KPI cards passes Test 1 but fails here.
 */
test('Malmö-sidan visar värden och inte bara tomma kort', async ({ page }) => {
  await page.goto('/malmo');

  await expect(page.locator(MAIN)).toContainText(/\d/);
});

/**
 * Test 3: Malmö and Lund show different data.
 * Compares the main content of the two pages and checks that they differ.
 * Pass: the page reads the municipality from the route and fetches its data.
 * Fail: the data is hardcoded, the route parameter is ignored, or both pages
 * fall back to the same default.
 * Note: this catches a bug none of the other tests can. A page that always
 * renders Malmö's numbers passes every test above this one.
 */
test('Malmö och Lund visar olika data', async ({ page }) => {
  await page.goto('/malmo');
  const malmo = await page.locator(MAIN).innerText();

  await page.goto('/lund');
  const lund = await page.locator(MAIN).innerText();

  expect(malmo.trim()).not.toBe('');
  expect(lund).not.toBe(malmo);
});
