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

  afterEach(async () => {
    if (dir) await rm(dir, { recursive: true, force: true });
    dir = undefined;
  });

  test('strips the configured base from an absolute script src before resolving it under dist', async () => {
    dir = await mkdtemp(join(tmpdir(), 'js-budget-'));
    const scriptBytes = Buffer.from('console.log("hello world");', 'utf8');
    await mkdir(join(dir, '_astro'), { recursive: true });
    await writeFile(join(dir, '_astro', 'a.js'), scriptBytes);
    await writeFile(
      join(dir, 'index.html'),
      '<!doctype html><html><head><script src="/real-portfolio/_astro/a.js"></script></head><body></body></html>',
    );

    const totals = await pageJsTotals(dir, '/real-portfolio');

    expect(totals).toEqual([{ path: 'index.html', bytes: scriptBytes.byteLength }]);
  });
});
