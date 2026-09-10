import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { findReplaceTokens } from '../../src/lib/replace-guard';

describe('findReplaceTokens', () => {
  let dir: string | undefined;

  afterEach(async () => {
    if (dir) await rm(dir, { recursive: true, force: true });
    dir = undefined;
  });

  test('counts REPLACE occurrences per page and ignores clean pages', async () => {
    const tmp = await mkdtemp(join(tmpdir(), 'replace-guard-'));
    dir = tmp;
    await mkdir(join(tmp, 'about'), { recursive: true });
    await writeFile(
      join(tmp, 'about', 'index.html'),
      '<!doctype html><html><body><p>REPLACE this and REPLACE that.</p></body></html>',
    );
    await writeFile(join(tmp, 'index.html'), '<!doctype html><html><body><p>All set.</p></body></html>');

    const offenders = await findReplaceTokens(tmp);

    expect(offenders).toEqual([{ path: join('about', 'index.html'), count: 2 }]);
  });

  test('returns an empty array when no page contains the token', async () => {
    const tmp = await mkdtemp(join(tmpdir(), 'replace-guard-'));
    dir = tmp;
    await writeFile(join(tmp, 'index.html'), '<!doctype html><html><body><p>All set.</p></body></html>');

    expect(await findReplaceTokens(tmp)).toEqual([]);
  });
});
