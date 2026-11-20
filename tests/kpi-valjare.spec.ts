import { test, expect, type Page } from '@playwright/test';

/**
 * Tests for the KPI selector at the top of /analysvy (issue #10).
 *
 * The selector has three parts: five data source dropdowns, a date range, and
 * a historical comparison switch. Nothing on the page uses the choices yet
 * (the chart is issue #11), so these tests check what the selector itself
 * shows.
 *
 * Each data source dropdown is a real <select> with a hidden label
 * ("Datakälla 1" to "Datakälla 5"), laid invisibly over the visible box. The
 * tests use the label to find it and read the visible text next to it.
 *
 * The defaults below are copied from defaultAnalysisSelection in
 * src/components/SydvattenKPI/analysis/kpiOptions.tsx. That file cannot be
 * imported here, because it imports SVG icons that only Vite can load. If the
 * defaults change on purpose, update them here too.
 */

const DEFAULT_SOURCES = ['electricity', 'waterProduction', 'precipitation', 'waterLevel', ''];
const DEFAULT_PERIOD = { from: '2025-01-01', to: '2025-12-31' };
const DEFAULT_HISTORY_YEARS = 5;

// The <select> for data source number `position` (1–5).
function sourceSelect(page: Page, position: number) {
  return page.getByLabel(`Datakälla ${position}`, { exact: true });
}

// The visible text in the box: "<position>. <source>" and the unit below it.
// It is the box's second <span>, after the icon. The box itself also contains
// every <option>, so its full text cannot be used.
function sourceText(page: Page, position: number) {
  return sourceSelect(page, position).locator('..').locator(':scope > span').nth(1);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/analysvy');
});

/**
 * Test 1: The selector starts with the default choices.
 * Compares each dropdown with DEFAULT_SOURCES.
 * Pass: there are five dropdowns, and each shows its default source.
 * Fail: a dropdown is missing, or the page does not start from
 * DEFAULT_SOURCES.
 */
test('KPI-väljaren visar fem datakällor med förvalda val', async ({ page }) => {
  await expect(page.getByLabel(/^Datakälla \d$/)).toHaveCount(DEFAULT_SOURCES.length);

  for (const [index, source] of DEFAULT_SOURCES.entries()) {
    await expect(sourceSelect(page, index + 1)).toHaveValue(source);
  }
  await expect(sourceText(page, 1)).toHaveText(/^1\. Elförbrukning\s*\(kWh\)$/);
  await expect(sourceText(page, 5)).toHaveText('5. Ingen vald');
});

/**
 * Test 2: The same data source cannot be chosen twice.
 * Checks that a source chosen in box 1 is disabled in box 5, and that it can
 * be chosen again once box 1 is cleared.
 * Pass: taken sources are disabled in the other boxes, and freed ones are
 * enabled again.
 * Fail: the same source can be chosen in two boxes, or a cleared source stays
 * disabled.
 */
test('samma datakälla kan inte väljas i två rutor', async ({ page }) => {
  const electricityInBox5 = sourceSelect(page, 5).locator('option[value="electricity"]');

  await expect(electricityInBox5).toBeDisabled();

  await sourceSelect(page, 1).selectOption('');

  await expect(electricityInBox5).toBeEnabled();
});

/**
 * Test 3: Choosing and clearing a source updates the visible box.
 * Chooses "Befolkning" in the empty box 5, then clears box 1.
 * Pass: box 5 shows the source name and its unit, and box 1 shows
 * "Ingen vald".
 * Fail: the box keeps showing the old text, so the user sees a different
 * choice than the one that is stored.
 */
test('en vald datakälla visas i rutan och kan tas bort', async ({ page }) => {
  await sourceSelect(page, 5).selectOption('population');

  await expect(sourceText(page, 5)).toHaveText(/^5\. Befolkning\s*\(invånare\)$/);

  await sourceSelect(page, 1).selectOption('');

  await expect(sourceText(page, 1)).toHaveText('1. Ingen vald');
});

/**
 * Test 4: The time period starts with the default dates.
 * Pass: the date field shows DEFAULT_PERIOD.
 * Fail: the date picker does not start, or shows another range.
 */
test('tidsperioden visar förvalt start- och slutdatum', async ({ page }) => {
  const { from, to } = DEFAULT_PERIOD;

  await expect(page.locator('#analysis-period')).toHaveValue(`${from} – ${to}`);
});

/**
 * Test 5: The historical comparison can be turned off and on.
 * Clicks the switch and checks that the list of years hides and shows.
 * Pass: the year list is shown with the default number of years, hides when
 * the switch is turned off, and comes back when it is turned on.
 * Fail: the switch does nothing, or the year list has the wrong default.
 * Note: the switch has no checkbox or switch role, so the test clicks its
 * text. A screen reader cannot tell whether it is on or off.
 */
test('historisk jämförelse kan slås av och på', async ({ page }) => {
  const toggle = page.getByText('Historisk jämförelse', { exact: true });
  const years = page.getByRole('combobox').filter({ hasText: 'Föregående' });

  await expect(years).toHaveValue(String(DEFAULT_HISTORY_YEARS));

  await toggle.click();
  await expect(years).toHaveCount(0);

  await toggle.click();
  await expect(years).toBeVisible();
});
