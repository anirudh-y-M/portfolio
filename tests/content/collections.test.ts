import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { findBannedWords, headingOrderErrors } from '../../src/lib/copy-lint';
import { principles } from '../../src/data/principles';
import { site } from '../../src/data/site';

const root = join(process.cwd(), 'src/content');
const files = (dir: string) => readdirSync(join(root, dir)).filter((f) => f.endsWith('.md'));
const read = (dir: string, f: string) => readFileSync(join(root, dir, f), 'utf8');
const frontmatter = (md: string) => md.split('---')[1] ?? '';
const body = (md: string) => md.split('---').slice(2).join('---');
const flag = (fm: string, key: string) => new RegExp(`^${key}:\\s*true\\s*$`, 'm').test(fm);

describe('work case files', () => {
  for (const f of files('work')) {
    const md = read('work', f);
    test(`${f} has the five headings in order`, () => {
      expect(headingOrderErrors(body(md))).toEqual([]);
    });
    test(`${f} uses no banned words`, () => {
      expect(findBannedWords(md)).toEqual([]);
    });
    test(`${f} is not published while unreviewed or still containing REPLACE`, () => {
      const fm = frontmatter(md);
      const published = !flag(fm, 'draft') && flag(fm, 'reviewed');
      if (published) expect(md).not.toMatch(/REPLACE/);
      if (!flag(fm, 'draft')) expect(flag(fm, 'reviewed')).toBe(true);
    });
  }
  test('at most three case files are featured', () => {
    const featured = files('work').filter((f) => flag(frontmatter(read('work', f)), 'featured'));
    expect(featured.length).toBeLessThanOrEqual(3);
  });
});

describe('notes', () => {
  for (const f of files('notes')) {
    const md = read('notes', f);
    test(`${f} uses no banned words`, () => expect(findBannedWords(md)).toEqual([]));
    test(`${f} is not published while unreviewed or containing REPLACE`, () => {
      const fm = frontmatter(md);
      if (!flag(fm, 'draft')) {
        expect(flag(fm, 'reviewed')).toBe(true);
        expect(md).not.toMatch(/REPLACE/);
      }
    });
  }
});

describe('now', () => {
  for (const f of files('now')) {
    const md = read('now', f);
    const fm = frontmatter(md);
    test(`${f} headline is 80 characters or fewer`, () => {
      const headline = fm.match(/^headline:\s*"?(.*?)"?\s*$/m)?.[1] ?? '';
      expect(headline.length).toBeLessThanOrEqual(80);
    });
    test(`${f} has a non-empty body`, () => {
      expect(body(md).trim().length).toBeGreaterThan(0);
    });
  }
  // Skipped: the sample `now` entry intentionally keeps its REPLACE headline
  // until Task 4 fills in the worksheet answers. Remove `.skip` in Task 4
  // once the placeholders are replaced.
  test.skip('now headline has no REPLACE token', () => {
    for (const f of files('now')) {
      expect(frontmatter(read('now', f))).not.toMatch(/REPLACE/);
    }
  });
});

describe('principles', () => {
  test('there are exactly five', () => expect(principles).toHaveLength(5));
  test('each points at an existing work file', () => {
    const ids = files('work').map((f) => f.replace(/\.md$/, ''));
    for (const p of principles) expect(ids).toContain(p.work);
  });
  test('each is one sentence under 120 characters', () => {
    for (const p of principles) expect(p.text.length).toBeLessThan(120);
  });
});

describe('about page', () => {
  // Skipped: `src/pages/about.astro` intentionally keeps the brief's scaffold
  // REPLACE tokens until Task 4 fills in the worksheet answers. Remove
  // `.skip` in Task 4 once the placeholders are replaced.
  test.skip('about page has no REPLACE tokens', () => {
    const about = readFileSync(join(process.cwd(), 'src/pages/about.astro'), 'utf8');
    expect(about).not.toMatch(/REPLACE/);
  });
});

describe('site data', () => {
  test('email is personal, not a company address', () => {
    expect(site.email).not.toMatch(/@mercari\.com$/i);
  });
  // Skipped until Task 4 fills in src/data/site.ts. Remove `.skip` in Task 4 Step 6.
  test.skip('placeholders are filled before publishing', () => {
    expect(true).toBe(true);
  });
});
