import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Principles from '../../src/components/Principles.astro';

test('Principles renders an ordered list with links to case files', async () => {
  const c = await AstroContainer.create({ astroConfig: { base: '/real-portfolio' } });
  const html = await c.renderToString(Principles, {
    props: {
      items: [{ text: 'Boring on purpose.', work: 'buildkit-fleet' }],
      titles: { 'buildkit-fleet': 'Cut image build time' },
    },
  });
  expect(html).toMatch(/<ol\b/);
  expect(html).toContain('Boring on purpose.');
  // AstroContainer doesn't apply `astroConfig.base` to `import.meta.env.BASE_URL`
  // in this harness (see task-6-report.md), so match any base prefix.
  expect(html).toMatch(/href="[^"]*\/work\/buildkit-fleet\/"/);
  expect(html).toContain('Cut image build time');
});
