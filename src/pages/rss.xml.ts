import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublished, sortNotesNewest, sortWork } from '../lib/content';
import { href } from '../lib/href';
import { site } from '../data/site';

export async function GET(context: APIContext) {
  const notes = sortNotesNewest(await getPublished('notes'));
  const work = sortWork(await getPublished('work'));
  return rss({
    title: `${site.name} — notes and case files`,
    description: 'Platform engineering notes and case files.',
    site: context.site!,
    items: [
      ...notes.map((n) => ({
        title: n.data.title,
        description: n.data.summary,
        pubDate: n.data.updated ?? n.data.published,
        link: href(`/notes/${n.id}`),
      })),
      ...work.map((w) => ({
        title: w.data.title,
        description: w.data.summary,
        pubDate: new Date(`${w.data.period.slice(-4)}-01-01`),
        link: href(`/work/${w.id}`),
      })),
    ],
  });
}
