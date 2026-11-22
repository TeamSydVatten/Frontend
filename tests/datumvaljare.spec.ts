import { test, expect, type Page } from '@playwright/test';

/**
 * Tests for the date range picker (issue #22) on Energiöversikt (/elOverview)
 * and the flow chart on the municipality pages (/kommun/malmo).
 *
 * The tests run against the real backend (started by playwright.config.ts)
 * and read whatever data the local database has, so they check behaviour
 * (the period changes, values render) rather than exact numbers.
 *
 * The calendar uses the browser locale, so the tests run in Swedish to get
 * stable labels ("30 dagar", Swedish month and day names).
 */

test.use({ locale: 'sv-SE' });

const MAIN = 'main';

/** The picker button, e.g. "24 sep. 2026 – 30 sep. 2026" */
const pickerButton = (page: Page) =>
  page.locator(MAIN).getByRole('button', { name: /\d{4} – .*\d{4}/ });

/** Opens the picker and waits for the calendar */
async function openPicker(page: Page) {
  await pickerButton(page).click();
  await expect(page.getByRole('dialog')).toBeVisible();
}

/**
 * Test 1: Energiöversikt shows the date picker with 7 days as default.
 * Waits for the picker button and the summary card for the period.
 * Pass: the picker replaced the old 7/30 buttons and starts on the last week
 * that has data.
 * Fail: the picker is missing, or the page could not find the latest data.
 * Note: the default ends on the last day with data, not today, since the data
 * does not always reach today.
 */
test('Energiöversikt visar datumväljaren med 7 dagar som standard', async ({ page }) => {
  await page.goto('/elOverview');

  await expect(pickerButton(page)).toBeVisible();
  await expect(page.locator(MAIN)).toContainText('7 dagar i vald period');
  await expect(page.locator(MAIN)).toContainText(/\d[\d\s]*,\d kWh/);
});

/**
 * Test 2: The picker opens with presets and a calendar.
 * Clicks the picker button and checks the presets and the calendar grid.
 * Pass: the shadcn popover and RangeCalendar render.
 * Fail: the popover does not open (missing react-aria-components or shadcn
 * files), or the presets are missing.
 */
test('Datumväljaren öppnas med snabbval och kalender', async ({ page }) => {
  await page.goto('/elOverview');
  await openPicker(page);

  const dialog = page.getByRole('dialog');
  for (const label of ['7 dagar', '30 dagar', '90 dagar', '1 år']) {
    await expect(dialog.getByRole('button', { name: label })).toBeVisible();
  }
  await expect(dialog.getByRole('grid').first()).toBeVisible();
});

/**
 * Test 3: A preset changes the period.
 * Picks "30 dagar" and checks that the summary card follows.
 * Pass: the preset updates the period and new data is fetched.
 * Fail: the picker does not report the new range to the page.
 */
test('Snabbvalet 30 dagar ändrar perioden', async ({ page }) => {
  await page.goto('/elOverview');
  await expect(page.locator(MAIN)).toContainText('7 dagar i vald period');

  await openPicker(page);
  await page.getByRole('dialog').getByRole('button', { name: '30 dagar' }).click();

  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.locator(MAIN)).toContainText('30 dagar i vald period');
});

/**
 * Test 4: A custom range can be picked with two clicks.
 * Clicks the first and tenth selectable day in the last month and checks
 * that the period becomes 10 days.
 * Pass: start and end day are picked and the popover closes.
 * Fail: the range selection or the conversion to dates is broken.
 * Note: uses selectable days in the last visible month instead of fixed
 * dates, so the test does not depend on exactly which dates have data.
 */
test('Egen period kan väljas med två klick', async ({ page }) => {
  await page.goto('/elOverview');
  await openPicker(page);

  const lastMonth = page.getByRole('dialog').getByRole('grid').last();
  const days = lastMonth.locator('[role="gridcell"] [role="button"]:not([aria-disabled="true"])');

  await days.nth(0).click();
  await days.nth(9).click();

  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.locator(MAIN)).toContainText('10 dagar i vald period');
});

/**
 * Test 5: Energiöversikt only fetches the chosen period.
 * Records the API calls and checks that /power/period is used and
 * /power/data (all ~350 000 rows) is not.
 * Pass: the page asks the backend for the chosen period only.
 * Fail: someone switched back to /power/data, which makes the page hang
 * with the five years of data.
 */
test('Energiöversikt hämtar bara vald period, inte all eldata', async ({ page }) => {
  const calls: string[] = [];
  page.on('request', (req) => {
    if (req.url().includes(':8000/')) calls.push(new URL(req.url()).pathname);
  });

  await page.goto('/elOverview');
  await expect(page.locator(MAIN)).toContainText('7 dagar i vald period');
  await expect(page.locator(MAIN)).toContainText(/kWh/);

  expect(calls).toContain('/power/period');
  expect(calls).not.toContain('/power/data');
});

/**
 * Test 6: The Malmö page shows the flow chart with values.
 * Checks the heading, the average flow and the total volume.
 * Pass: daily flow reaches the page from /flow/period/municipality/.../daily.
 * Fail: the endpoint name changed in the backend, or the chart is missing.
 */
test('Malmö visar vattenflöde över tid med medelflöde och volym', async ({ page }) => {
  await page.goto('/kommun/malmo');

  await expect(page.getByRole('heading', { name: 'Vattenflöde över tid' })).toBeVisible();
  await expect(page.locator(MAIN)).toContainText(/Medelflöde i perioden\s*[\d\s]+,\d L\/s/);
  await expect(page.locator(MAIN)).toContainText(/Total volym i perioden\s*[\d\s]+ m³/);
});

/**
 * Test 7: The 5-year preset gives a much longer period on the Malmö page.
 * Reads the total volume, picks "5 år" and checks that the volume grows and
 * that the start year in the picker moves back.
 * Pass: the chart filters the five years of daily data by the chosen range.
 * Fail: the preset does nothing, or only part of the history was fetched.
 */
test('Snabbvalet 5 år visar längre historik i Malmö', async ({ page }) => {
  await page.goto('/kommun/malmo');

  const volume = page.locator(MAIN).getByText(/[\d\s]+ m³/).first();
  await expect(volume).toBeVisible();
  const before = Number((await volume.innerText()).replace(/\D/g, ''));
  const startBefore = Number((await pickerButton(page).innerText()).match(/\d{4}/)?.[0]);

  await openPicker(page);
  await page.getByRole('dialog').getByRole('button', { name: '5 år' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();

  await expect
    .poll(async () => Number((await volume.innerText()).replace(/\D/g, '')))
    .toBeGreaterThan(before * 10);
  const startAfter = Number((await pickerButton(page).innerText()).match(/\d{4}/)?.[0]);
  expect(startAfter).toBeLessThan(startBefore);
});
