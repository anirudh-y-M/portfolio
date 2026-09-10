import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublished, sortNotesNewest, sortWork } from '../lib/content';
import { periodEndYear } from '../lib/dates';
import { feedItems, feedSite } from '../lib/rss-items';
import { site } from '../data/site';

export async function GET(context: APIContext) {
  const notes = sortNotesNewest(await getPublished('notes'));
  const work = sortWork(await getPublished('work'));
  return rss({
    title: `${site.name} — notes and case files`,
    description: 'Platform engineering notes and case files.',
    // `context.site` is the bare origin configured in astro.config.mjs (no base); the channel
    // <link> must carry the base too. `feedItems` returns links relative to this (no leading
    // slash), so they resolve as children of the base rather than replacing it.
    site: feedSite(import.meta.env.BASE_URL, context.site!),
    items: feedItems(
      notes.map((n) => ({
        id: n.id,
        title: n.data.title,
        summary: n.data.summary,
        date: n.data.updated ?? n.data.published,
      })),
      work.map((w) => ({
        id: w.id,
        title: w.data.title,
        summary: w.data.summary,
        year: periodEndYear(w.data.period),
      })),
    ),
  });
}
