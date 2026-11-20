import { test, expect } from '@playwright/test';
import { locationById } from '../src/data/locations';

/**
 * Tests for the start page (/).
 *
 * The start page shows one LocationCard per water source (Vombsjön, Ringsjön,
 * Bolmen). The expected values are read from src/data/locations.tsx, so the
 * tests keep passing when the data changes but fail if the page stops
 * rendering what the data says.
 */

const LOCATIONS = [locationById.vomb, locationById.ringsjon, locationById.bolmen];

/**
 * Test 1: The start page loads.
 * Goes to / and checks that the "Översikt" heading is visible.
 * Pass: the index route renders the Home page.
 * Fail: the route is missing in App.tsx, or the page crashes before rendering.
 */
test('startsidan laddar och visar rubriken Översikt', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: /^Översikt$/ })
  ).toBeVisible();
});

/**
 * Test 2: The start page shows one card per water source, in order.
 * Collects the card headings and compares them with the names in the data.
 * Pass: all three cards render, in the order Vombsjön, Ringsjön, Bolmen.
 * Fail: a card is missing, a card is duplicated, or the order has changed.
 */
test('startsidan visar ett kort per vattentäkt', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 3 })).toHaveText(
    LOCATIONS.map((location) => location.name)
  );
});

/**
 * Test 3: Each card shows the water flow and water level from the data.
 * Finds each card by its heading and checks its description and values.
 * Pass: every card renders its own description, flow and level.
 * Fail: a value is missing, a card shows another location's data, or the
 * text format has changed.
 * Note: Vombsjön and Helgeån share the same values, so the description check
 * is what tells the cards apart if the wrong location is passed in.
 */
for (const location of LOCATIONS) {
  test(`kortet för ${location.name} visar flöde och nivå`, async ({ page }) => {
    await page.goto('/');

    const card = page
      .locator('div')
      .filter({ has: page.getByRole('heading', { name: location.name, exact: true }) })
      .last();

    await expect(card).toContainText(location.description);
    await expect(card).toContainText(`Vattenflöde: ${location.waterflow} m³/s`);
    await expect(card).toContainText(`Vattennivå: ${location.waterlevel} MöH`);
  });
}
