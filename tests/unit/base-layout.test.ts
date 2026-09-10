import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import BaseLayout from '../../src/layouts/BaseLayout.astro';

test('BaseLayout has skip link, nav, main landmark, and title', async () => {
  const container = await AstroContainer.create({
    astroConfig: {
      site: 'https://anirudh-y-m.github.io',
      base: '/real-portfolio',
      trailingSlash: 'always',
    },
  });
  const html = await container.renderToString(BaseLayout, {
    props: { title: 'Test', description: 'A test page', path: '/work' },
    slots: { default: '<p>hello</p>' },
  });
  expect(html).toContain('class="skip-link"');
  // Astro's scoped `<style>` in SiteHeader injects a data-astro-cid-* attribute
  // onto every element it renders, so match the nav landmark tolerant of that.
  expect(html).toMatch(/<nav[^>]*\baria-label="Primary"[^>]*>/);
  expect(html).toContain('<main id="main"');
  expect(html).toContain('aria-current="page"');
  expect(html).toContain('<title>Test — Anirudh Yadav</title>');
  expect(html).toContain('<p>hello</p>');
  // The JS budget (integrations/js-budget.ts) requires every page to ship
  // well under 5 KB of JavaScript, which rules out a client-side router.
  // Navigation transitions come from CSS-only cross-document view
  // transitions (src/styles/global.css) instead of astro:transitions'
  // <ClientRouter />, so the layout must not emit any module script.
  expect(html).not.toMatch(/<script[^>]*type="module"/);
});
