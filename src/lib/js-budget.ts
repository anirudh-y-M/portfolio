import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';

export interface PageJs {
  path: string;
  bytes: number;
  /** URLs of any external (`http(s)://` or protocol-relative `//`) `<script src>` on this page. */
  externals?: string[];
}

/** An external script's byte cost is unknowable at build time and cannot be budgeted, so it
 * always counts as an offender. */
function isExternalSrc(src: string): boolean {
  return /^(?:https?:)?\/\//.test(src);
}

export function checkBudget(files: PageJs[], limitBytes: number): { ok: boolean; offenders: PageJs[] } {
  const offenders = files.filter((f) => f.bytes > limitBytes);
  return { ok: offenders.length === 0, offenders };
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

/** Normalise a site base path: leading slash, no trailing slash unless it is the root. */
function normalizeBase(base: string): string {
  const withLeading = base.startsWith('/') ? base : `/${base}`;
  if (withLeading === '/') return '/';
  return withLeading.endsWith('/') ? withLeading.slice(0, -1) : withLeading;
}

/**
 * Resolve an absolute script `src` (e.g. "/real-portfolio/_astro/a.js") to a file under `dist`.
 * Astro's build output has no `base` segment on disk (Ruling B) — the base only appears in
 * emitted URLs — so it must be stripped from `src` before joining onto `dist`. This is
 * forward-looking for local `<script src>` files beyond `dist/_astro`; the site currently ships
 * only the inline status-strip script, so no such `src` is resolved in production today.
 */
function resolveAbsoluteSrc(dist: string, base: string, src: string): string {
  const normBase = normalizeBase(base);
  // Match the base as a whole path segment, not merely a string prefix, so a short base like
  // "/re" never matches an unrelated "/real-portfolio/..." src.
  const stripped =
    normBase !== '/' && (src === normBase || src.startsWith(`${normBase}/`)) ? src.slice(normBase.length) : src;
  return resolve(dist, `.${stripped}`);
}

/** Sum inline script bytes and local script file bytes for each HTML page in dist. */
export async function pageJsTotals(dist: string, base = '/'): Promise<PageJs[]> {
  const pages = await walk(dist);
  const results: PageJs[] = [];
  for (const page of pages) {
    const html = await readFile(page, 'utf8');
    let bytes = 0;
    const externals: string[] = [];
    for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      const attrs = m[1];
      const src = attrs.match(/\bsrc="([^"]+)"/)?.[1];
      if (src && isExternalSrc(src)) {
        // An external script's size is unknowable at build time: always flag it rather than
        // silently treat it as free.
        bytes += Number.POSITIVE_INFINITY;
        externals.push(src);
      } else if (src) {
        const file = src.startsWith('/') ? resolveAbsoluteSrc(dist, base, src) : resolve(dirname(page), src);
        try {
          bytes += (await stat(file)).size;
        } catch {
          /* missing; ignored */
        }
      } else {
        bytes += Buffer.byteLength(m[2], 'utf8');
      }
    }
    results.push({ path: relative(dist, page), bytes, ...(externals.length ? { externals } : {}) });
  }
  return results;
}
