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
  // See the note in case-file-card.test.ts: `AstroContainer`'s `astroConfig.base`
  // does not reach `import.meta.env.BASE_URL` in this harness, so `href()`
  // falls back to `/`. The `/real-portfolio` prefix is verified against the
  // actual `dist/` build output instead (see task-6-report.md).
  expect(html).toContain('href="/work/buildkit-fleet/"');
  expect(html).toContain('Cut image build time');
});
