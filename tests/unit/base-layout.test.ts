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
});
