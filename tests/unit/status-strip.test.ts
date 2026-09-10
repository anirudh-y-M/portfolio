import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import StatusStrip from '../../src/components/StatusStrip.astro';

test('StatusStrip renders role, city, JST time, and the now headline', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(StatusStrip, {
    props: { headline: 'shipping build-cache fleet v2', buildTime: new Date('2026-09-10T05:32:00Z') },
  });
  expect(html).toContain('Platform engineer');
  expect(html).toContain('Mercari, Tokyo');
  expect(html).toMatch(/<time[^>]*\bid="jst"/);
  expect(html).toContain('14:32');
  expect(html).toContain('shipping build-cache fleet v2');
  const script = html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? '';
  expect(script.length).toBeLessThan(300);
});
