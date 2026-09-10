import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Index from '../../src/pages/index.astro';

test('home page renders a level-one heading', async () => {
  const container = await AstroContainer.create({
    astroConfig: {
      site: 'https://anirudh-y-m.github.io',
      base: '/real-portfolio',
      trailingSlash: 'always',
    },
  });
  const html = await container.renderToString(Index);
  expect(html).toMatch(/<h1[^>]*>/);
});
