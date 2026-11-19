import { test, expect, type Page } from '@playwright/test';
import { navItems } from '../src/layout/navItems';

/**
 * Tests for the quick links on the start page (issue #15).
 *
 * The issue: not every quick link worked, and some links were missing. The fix
 * builds the quick links from the same list as the side menu
 * (src/layout/navItems.tsx). These tests read that list, so a page added to the
 * menu is tested automatically.
 *
 * The links are found by position, not by label, because the labels come from
 * the translation files and change with the language.
 */

// Every link in the side menu, in the order the start page renders them.
const LINKS = navItems.flatMap((group) => group.subItems ?? []);

// The quick link buttons, in render order.
function quickLinks(page: Page) {
  return page.locator('main').getByRole('button');
}

/**
 * Test 1: The start page shows one quick link per menu link.
 * Counts the buttons on the start page and compares with navItems.
 * Pass: every page in the side menu has a quick link.
 * Fail: a quick link is missing ("Dessutom finns inte längre alla länkar"),
 * or the start page renders extra buttons.
 */
test('startsidan har en snabblänk per sida i menyn', async ({ page }) => {
  await page.goto('/');

  await expect(quickLinks(page)).toHaveCount(LINKS.length);
});

/**
 * Test 2: Every quick link leads to a working page.
 * Clicks each quick link and checks the URL, that the 404 page is not shown,
 * and that the page renders content inside the layout.
 * Pass: the link goes to its path, and the path has a route in App.tsx.
 * Fail: the link goes to the wrong path, the path has no route (404), or the
 * page crashes and renders an empty layout.
 * Note: the 404 page sits outside AppLayout, so a missing route also means
 * <main> disappears.
 */
LINKS.forEach((link, index) => {
  test(`snabblänken till ${link.path} fungerar`, async ({ page }) => {
    await page.goto('/');

    await quickLinks(page).nth(index).click();

    await expect(page).toHaveURL(new RegExp(`${link.path}$`));
    await expect(page.getByRole('img', { name: '404' })).toHaveCount(0);
    await expect(page.locator('main')).not.toBeEmpty();
  });
});
