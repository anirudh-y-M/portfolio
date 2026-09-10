import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Contact from '../../src/components/Contact.astro';
import { site } from '../../src/data/site';

test('Contact has exactly one mailto and the two profile links', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Contact);
  expect(html.match(/href="mailto:/g)?.length).toBe(1);
  expect(html).toContain(`href="mailto:${site.email}"`);
  expect(html).toContain(`href="${site.github}"`);
  expect(html).toContain(`href="${site.linkedin}"`);
  expect(html).not.toContain('<form');
});
