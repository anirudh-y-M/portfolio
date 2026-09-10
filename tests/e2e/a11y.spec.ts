import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const FALLBACK_ROUTES = ['./', './work/', './notes/', './now/', './about/'];

/**
 * Read the routes to exercise from the built sitemap (`dist/sitemap-0.xml`) rather than a
 * hardcoded list, so a detail page (e.g. `/work/<id>/`) is picked up automatically once its
 * content publishes. Falls back to the five static routes if the build hasn't run yet.
 */
function sitemapRoutes(): string[] {
  let xml: string;
  try {
    xml = readFileSync(join(process.cwd(), 'dist/sitemap-0.xml'), 'utf8');
  } catch {
    return FALLBACK_ROUTES;
  }
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  if (locs.length === 0) return FALLBACK_ROUTES;
  return locs.map((loc) => `.${new URL(loc).pathname.replace(/^\/real-portfolio/, '')}`);
}

const routes = sitemapRoutes();

for (const route of routes) {
  test(`${route} has no serious or critical accessibility violations`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(bad, JSON.stringify(bad, null, 2)).toEqual([]);
  });
}

test('dark mode keeps contrast', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('./');
  const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
  expect(results.violations).toEqual([]);
});
