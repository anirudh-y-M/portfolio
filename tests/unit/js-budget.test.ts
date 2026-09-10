import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { checkBudget, pageJsTotals } from '../../src/lib/js-budget';

describe('checkBudget', () => {
  test('passes when every page is under the limit', () => {
    const r = checkBudget([{ path: 'index.html', bytes: 300 }, { path: 'work/index.html', bytes: 0 }], 5120);
    expect(r.ok).toBe(true);
    expect(r.offenders).toEqual([]);
  });
  test('lists offenders over the limit', () => {
    const r = checkBudget([{ path: 'index.html', bytes: 6000 }, { path: 'now/index.html', bytes: 5121 }], 5120);
    expect(r.ok).toBe(false);
    expect(r.offenders.map((o) => o.path)).toEqual(['index.html', 'now/index.html']);
  });
});

describe('pageJsTotals', () => {
  let dir: string | undefined;
  const scriptBytes = Buffer.from('console.log("hello world");', 'utf8');

  afterEach(async () => {
    if (dir) await rm(dir, { recursive: true, force: true });
    dir = undefined;
  });

  /** A dist fixture: a real `_astro/a.js` and an `index.html` whose one `<script>` references `scriptSrc`. */
  async function makeFixture(scriptSrc: string): Promise<string> {
    const tmp = await mkdtemp(join(tmpdir(), 'js-budget-'));
    await mkdir(join(tmp, '_astro'), { recursive: true });
    await writeFile(join(tmp, '_astro', 'a.js'), scriptBytes);
    await writeFile(
      join(tmp, 'index.html'),
      `<!doctype html><html><head><script src="${scriptSrc}"></script></head><body></body></html>`,
    );
    return tmp;
  }

  test('strips the configured base from an absolute script src before resolving it under dist', async () => {
    dir = await makeFixture('/real-portfolio/_astro/a.js');

    const totals = await pageJsTotals(dir, '/real-portfolio');

    expect(totals).toEqual([{ path: 'index.html', bytes: scriptBytes.byteLength }]);
  });

  test('resolves a root base ("/") without stripping anything', async () => {
    dir = await makeFixture('/_astro/a.js');

    const totals = await pageJsTotals(dir, '/');

    expect(totals).toEqual([{ path: 'index.html', bytes: scriptBytes.byteLength }]);
  });

  test('normalises a trailing slash on the base, as Astro may pass under trailingSlash: "always"', async () => {
    dir = await makeFixture('/real-portfolio/_astro/a.js');

    const totals = await pageJsTotals(dir, '/real-portfolio/');

    expect(totals).toEqual([{ path: 'index.html', bytes: scriptBytes.byteLength }]);
  });

  test('only strips the base as a whole path segment, never a mere string prefix', async () => {
    dir = await makeFixture('/real-portfolio/_astro/a.js');

    // base "/re" is a string prefix of the src's "/real-portfolio" segment but not a path-segment
    // match, so it must not be stripped — the src is then resolved as dist/real-portfolio/_astro/a.js,
    // which does not exist (the fixture's script lives at dist/_astro/a.js), so 0 bytes are counted.
    const totals = await pageJsTotals(dir, '/re');

    expect(totals).toEqual([{ path: 'index.html', bytes: 0 }]);
  });
});
