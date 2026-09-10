import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import CaseFileCard from '../../src/components/CaseFileCard.astro';

test('CaseFileCard links to the case file and shows before → after', async () => {
  const c = await AstroContainer.create({ astroConfig: { base: '/real-portfolio' } });
  const html = await c.renderToString(CaseFileCard, {
    props: {
      id: 'buildkit-fleet',
      title: 'Cut image build time',
      summary: 'Pooled BuildKit.',
      period: '2026',
      outcome: { metric: 'p50 build time', before: '14 min', after: '4 min' },
    },
  });
  // NOTE: `AstroContainer.create({ astroConfig: { base } })` does not affect
  // `import.meta.env.BASE_URL` in this Astro/Vite version — Vite computes that
  // reserved env var from its own resolved `config.base`, which Astro's
  // `getViteConfig()` never sets from the loaded astro.config.mjs `base`
  // (confirmed by inspecting `astro/dist/container/index.js`, which only reads
  // `astroConfig.site` into the manifest, and Vite's `import.meta.env` builder,
  // which ignores custom `define` entries for this reserved key). So in this
  // unit-test harness `href()` always falls back to `base: '/'`; the real
  // `/real-portfolio` prefix is verified against the actual `dist/` build
  // output instead (see task-6-report.md).
  expect(html).toContain('href="/work/buildkit-fleet/"');
  expect(html).toMatch(/<h3\b/);
  expect(html).toContain('14 min');
  expect(html).toContain('4 min');
  expect(html).toContain('p50 build time');
});

test('CaseFileCard omits the outcome line when absent', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(CaseFileCard, {
    props: { id: 'x', title: 'T', summary: 'S', period: '2025' },
  });
  expect(html).not.toMatch(/class="outcome/);
});
