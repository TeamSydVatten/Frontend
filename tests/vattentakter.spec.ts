import { test, expect, type Page } from '@playwright/test';
import { locationById } from '../src/data/locations';

/**
 * Tests for the water source pages (/vomb, /ringsjon, /bolmen).
 *
 * startsida.spec.ts covers the cards on the start page. This file covers what
 * happens after "Visa detaljer": that the button leads to the right page, and
 * that each page shows its own heading, title and data.
 *
 * The headings and titles are written out below instead of read from the data,
 * because the pages hardcode them (the Vomb page says "Vomb", not "Vombsjön").
 */

const PAGES = [
  { location: locationById.vomb, heading: 'Vomb', title: 'Vombsjön Översikt | Sydvatten' },
  { location: locationById.ringsjon, heading: 'Ringsjön', title: 'Ringsjön | Sydvatten' },
  { location: locationById.bolmen, heading: 'Bolmen', title: 'Bolmen | Sydvatten' },
];

// Bolmen only shows a chart so far, so the KPI card tests skip it.
const PAGES_WITH_CARDS = PAGES.filter(({ location }) => location.id !== 'bolmen');

// Returns the KPI card whose label is exactly `label`, e.g. "Vattennivå".
function kpiCard(page: Page, label: string) {
  return page.locator('main').getByText(label, { exact: true }).locator('..');
}

/**
 * Test 1: "Visa detaljer" leads to the right water source.
 * Clicks the button on each start page card and checks the URL.
 * Pass: each card links to its own page.
 * Fail: a button is missing, leads to another water source, or a location id
 * in src/data/locations.tsx no longer matches a route in App.tsx.
 */
for (const { location } of PAGES) {
  test(`"Visa detaljer" för ${location.name} går till /${location.id}`, async ({ page }) => {
    await page.goto('/');

    const card = page
      .locator('div')
      .filter({ has: page.getByRole('heading', { name: location.name, exact: true }) })
      .last();
    await card.getByRole('button', { name: 'Visa detaljer' }).click();

    await expect(page).toHaveURL(new RegExp(`/${location.id}$`));
  });
}

/**
 * Test 2: Each water source page loads on direct navigation.
 * Goes straight to the page and checks the heading and the browser tab title.
 * Pass: the route works and PageMeta sets the right title.
 * Fail: the route is missing, the page renders without a heading, or the
 * title is missing or belongs to another page.
 * Note: no other test checks the tab title. A copied page that forgot to
 * change its PageMeta passes every other test.
 */
for (const { location, heading, title } of PAGES) {
  test(`${location.name}-sidan visar rubrik och fliktitel`, async ({ page }) => {
    await page.goto(`/${location.id}`);

    await expect(
      page.getByRole('heading', { name: heading, exact: true })
    ).toBeVisible();
    await expect(page).toHaveTitle(title);
  });
}

/**
 * Test 3: The KPI cards show the page's own water level and flow.
 * Reads the expected values from src/data/locations.tsx.
 * Pass: the page passes its own location to the cards.
 * Fail: a card is missing, shows another water source's values, or the
 * text format has changed.
 * Note: Vombsjön and Ringsjön have different values in the data, so a page
 * that passes the wrong location fails here.
 */
for (const { location } of PAGES_WITH_CARDS) {
  test(`${location.name}-sidan visar sin vattennivå och sitt flöde`, async ({ page }) => {
    await page.goto(`/${location.id}`);

    await expect(kpiCard(page, 'Vattennivå')).toContainText(
      `${location.waterlevel} meter över havet`
    );
    await expect(kpiCard(page, 'Senaste uppmätta vattenflöde')).toContainText(
      `${location.waterflow} liter / sekund`
    );
  });
}

/**
 * Test 4: The electricity card does not show the water flow.
 * Checks that the "Elförbrukning" card shows something other than the
 * location's water flow value.
 * Pass: the card shows its own electricity data.
 * Fail: the card reuses location.waterflow, which is the case today.
 * Note: KNOWN BUG. ElectricityPerRecievedWater.tsx renders
 * `{location.waterflow} Kilowatt / timme`. The test is marked test.fail(),
 * so it passes while the bug exists. When the bug is fixed this test turns
 * red with "expected to fail" — then remove the test.fail() line.
 */
for (const { location } of PAGES_WITH_CARDS) {
  test(`${location.name}-sidan visar inte vattenflödet som elförbrukning`, async ({ page }) => {
    test.fail(true, 'Known bug: the electricity card renders location.waterflow');
    await page.goto(`/${location.id}`);

    const electricity = kpiCard(page, 'Elförbrukning');
    await expect(electricity).toBeVisible();
    await expect(electricity).not.toContainText(
      `${location.waterflow} Kilowatt / timme`,
      { timeout: 2000 }
    );
  });
}
