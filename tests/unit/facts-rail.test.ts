import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import FactsRail from '../../src/components/FactsRail.astro';

test('FactsRail renders a description list with all facts and external links', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(FactsRail, {
    props: {
      period: '2026', org: 'Mercari', role: 'Platform engineer',
      stack: ['BuildKit', 'Kubernetes'],
      outcome: { metric: 'p50 build time', before: '14 min', after: '4 min' },
      links: [{ label: 'Repo', href: 'https://github.com/anirudh-y-M/docker-buildkit-fleet' }],
    },
  });
  expect(html).toContain('<dl');
  for (const s of ['2026', 'Mercari', 'Platform engineer', 'BuildKit', 'Kubernetes', 'p50 build time', '14 min', '4 min']) {
    expect(html).toContain(s);
  }
  expect(html).toContain('href="https://github.com/anirudh-y-M/docker-buildkit-fleet"');
  expect(html).toContain('rel="noopener"');
});
