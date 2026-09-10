import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import About from '../../src/pages/about.astro';
import { findBannedWords } from '../../src/lib/copy-lint';

test('About page has a bio, a toolbelt paragraph, and no banned words or skill icons', async () => {
  // `about.astro` renders through `BaseLayout` → `SEO.astro`, which reads
  // `Astro.site`; the container throws `Invalid URL` without it (see
  // tests/unit/base-layout.test.ts and tests/unit/smoke.test.ts for the same
  // pattern — task-6/8 reports).
  const c = await AstroContainer.create({
    astroConfig: {
      site: 'https://anirudh-y-m.github.io',
      base: '/real-portfolio',
      trailingSlash: 'always',
    },
  });
  const html = await c.renderToString(About);
  expect(html).toContain('<h1');
  expect(html).toContain('id="toolbelt"');
  expect(html).not.toMatch(/<img[^>]+(icon|logo)/i);
  expect(findBannedWords(html.replace(/<[^>]+>/g, ' '))).toEqual([]);
});
