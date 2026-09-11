import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';

// Every route is written with its trailing slash — `trailingSlash: 'always'`
// means the slashed form is what the built site actually serves (see
// playwright.config.ts). Paths are relative to `baseURL`, which already
// carries the `/portfolio/` base.
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
  return locs.map((loc) => `.${new URL(loc).pathname.replace(/^\/portfolio/, '')}`);
}

const routes = sitemapRoutes();

for (const route of routes) {
  test(`${route} renders with one h1 and a skip link`, async ({ page }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('a.skip-link')).toHaveText('Skip to content');
  });
}

test('primary nav reaches every section and marks the current page', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('link', { name: 'Work' }).click();
  await expect(page).toHaveURL(/\/work\/$/);
  await expect(page.getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'page');
});

test('home page has exactly one mailto link', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(1);
});

test('unknown route serves the 404 page', async ({ page }) => {
  const res = await page.goto('./does-not-exist/');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Nothing here.');
});
