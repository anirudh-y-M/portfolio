import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublished, sortNotesNewest, sortWork } from '../lib/content';
import { periodEndYear } from '../lib/dates';
import { href } from '../lib/href';
import { site } from '../data/site';

export async function GET(context: APIContext) {
  const notes = sortNotesNewest(await getPublished('notes'));
  const work = sortWork(await getPublished('work'));
  return rss({
    title: `${site.name} — notes and case files`,
    description: 'Platform engineering notes and case files.',
    // `context.site` is the bare origin configured in astro.config.mjs (no base); the channel
    // <link> must carry the base too, so resolve `href('/')` against it rather than passing the
    // bare origin straight through.
    site: new URL(href('/'), context.site).href,
    items: [
      ...notes.map((n) => ({
        title: n.data.title,
        description: n.data.summary,
        pubDate: n.data.updated ?? n.data.published,
        // Bare (no `href()`): `site` above already carries the base, and @astrojs/rss resolves
        // each item link against `site`, so running this through `href()` too would double it.
        link: `/notes/${n.id}/`,
      })),
      ...work.map((w) => {
        const year = periodEndYear(w.data.period);
        return {
          title: w.data.title,
          description: w.data.summary,
          pubDate: year ? new Date(Date.UTC(year, 0, 1)) : new Date(),
          link: `/work/${w.id}/`,
        };
      }),
    ],
  });
}
