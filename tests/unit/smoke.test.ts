import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test, vi } from 'vitest';

// `astro:content`'s `getCollection` reads from a data store that only the real
// `astro dev`/`astro build` content-layer sync populates; the `getViteConfig()`
// harness used for unit tests never runs that sync, so `getCollection` always
// resolves empty here (confirmed by direct testing — see task-6-report.md).
// `index.astro` now composes real content queries (`getPublished`, `latestNow`),
// and `latestNow()` throws when the `now` collection is empty, so this smoke
// test mocks the module with a minimal, single `now` entry to keep exercising
// real page composition without depending on that sync.
vi.mock('astro:content', () => ({
  getCollection: vi.fn(async (name: string) => {
    if (name === 'now') {
      return [{ id: '2026-09', data: { updated: new Date('2026-09-01'), headline: 'shipping build-cache fleet v2' } }];
    }
    return [];
  }),
}));

const Index = (await import('../../src/pages/index.astro')).default;

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
