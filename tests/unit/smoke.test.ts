import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Index from '../../src/pages/index.astro';

test('home page renders a level-one heading', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Index);
  expect(html).toMatch(/<h1[^>]*>/);
});
