import type { RSSFeedItem } from '@astrojs/rss';

interface NoteInput {
  id: string;
  title: string;
  summary: string;
  date: Date;
}

interface WorkInput {
  id: string;
  title: string;
  summary: string;
  year?: number;
}

/**
 * Build RSS item objects with links *relative to the feed's base* (no leading slash):
 * `notes/<id>/`, `work/<id>/`. `@astrojs/rss` resolves each item's `link` against the feed's
 * `site` (see `feedSite`) using the WHATWG `URL` constructor — a leading slash would be treated
 * as an absolute path and silently replace the base path segment (`/real-portfolio`) rather
 * than appending to it, 404ing every item once content publishes.
 */
export function feedItems(notes: NoteInput[], work: WorkInput[]): RSSFeedItem[] {
  return [
    ...notes.map((n) => ({
      title: n.title,
      description: n.summary,
      pubDate: n.date,
      link: `notes/${n.id}/`,
    })),
    ...work.map((w) => ({
      title: w.title,
      description: w.summary,
      pubDate: w.year ? new Date(Date.UTC(w.year, 0, 1)) : new Date(),
      link: `work/${w.id}/`,
    })),
  ];
}

/**
 * Resolve the feed's `site` (passed to `rss()`) so it carries the configured `base` path, not
 * just the bare origin `site` config carries on its own. `base` should be
 * `import.meta.env.BASE_URL`; a missing trailing slash is added so a later `new URL(itemLink,
 * feedSite(...))` resolves item links as children of the base rather than siblings of it.
 */
export function feedSite(base: string, site: URL): string {
  const normalized = base.endsWith('/') ? base : `${base}/`;
  return new URL(normalized, site).href;
}
