import { describe, expect, test } from 'vitest';
import { feedItems, feedSite } from '../../src/lib/rss-items';

describe('feedSite', () => {
  test('resolves a base path against the bare site origin', () => {
    expect(feedSite('/real-portfolio/', new URL('https://anirudh-y-m.github.io'))).toBe(
      'https://anirudh-y-m.github.io/real-portfolio/',
    );
  });
  test('adds a trailing slash to the base if missing', () => {
    expect(feedSite('/real-portfolio', new URL('https://anirudh-y-m.github.io'))).toBe(
      'https://anirudh-y-m.github.io/real-portfolio/',
    );
  });
});

describe('feedItems', () => {
  const notes = [{ id: 'x', title: 'Note X', summary: 'About x', date: new Date('2026-01-01') }];
  const work = [{ id: 'y', title: 'Work Y', summary: 'About y', year: 2026 }];

  test('links are relative to the feed base, with no leading slash', () => {
    const items = feedItems(notes, work);
    expect(items.map((i) => i.link)).toEqual(['notes/x/', 'work/y/']);
  });

  test('a relative item link resolves under the base, not as a sibling of it', () => {
    const site = feedSite('/real-portfolio/', new URL('https://anirudh-y-m.github.io'));
    const [item] = feedItems(notes, []);
    expect(new URL(item.link!, site).href).toBe('https://anirudh-y-m.github.io/real-portfolio/notes/x/');
  });

  test('a leading-slash link would 404 — resolving it against the base site replaces the base path', () => {
    // Documents the regression this module fixes: a leading slash is an absolute path per the
    // WHATWG URL spec, so it silently discards the `/real-portfolio` base instead of nesting
    // under it.
    const site = feedSite('/real-portfolio/', new URL('https://anirudh-y-m.github.io'));
    expect(new URL('/notes/x/', site).href).toBe('https://anirudh-y-m.github.io/notes/x/');
  });

  test('work items with no derivable year still fall back to a valid pubDate', () => {
    const [item] = feedItems([], [{ id: 'z', title: 'Work Z', summary: 'About z' }]);
    expect(item.pubDate).toBeInstanceOf(Date);
  });
});
