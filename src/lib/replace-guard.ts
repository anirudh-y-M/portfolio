import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

export interface ReplaceOffender {
  path: string;
  count: number;
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const name of await readdir(dir)) {
    const p = join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) out.push(...(await walk(p)));
    else if (p.endsWith('.html')) out.push(p);
  }
  return out;
}

/**
 * Walk `dist/**\/*.html` and count occurrences of the literal token `REPLACE` in each page.
 * Only pages with at least one occurrence are returned. This is the build-time gate that keeps
 * scaffold placeholders (`content/WORKSHEET.md` section I) from ever reaching a strict build.
 */
export async function findReplaceTokens(dist: string): Promise<ReplaceOffender[]> {
  const pages = await walk(dist);
  const offenders: ReplaceOffender[] = [];
  for (const page of pages) {
    const html = await readFile(page, 'utf8');
    const count = html.split('REPLACE').length - 1;
    if (count > 0) offenders.push({ path: relative(dist, page), count });
  }
  return offenders;
}
