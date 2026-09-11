import { describe, expect, test } from 'vitest';
import { getBuildInfo } from '../../src/lib/build-info';

describe('getBuildInfo', () => {
  const now = new Date('2026-09-10T05:00:00Z');
  test('reads GitHub Actions env', () => {
    const info = getBuildInfo({
      GITHUB_SHA: 'abcdef1234567890',
      GITHUB_SERVER_URL: 'https://github.com',
      GITHUB_REPOSITORY: 'anirudh-y-M/portfolio',
      GITHUB_RUN_ID: '42',
    }, now);
    expect(info.shortSha).toBe('abcdef1');
    expect(info.runUrl).toBe('https://github.com/anirudh-y-M/portfolio/actions/runs/42');
    expect(info.builtAt).toEqual(now);
  });
  test('is null-safe locally', () => {
    const info = getBuildInfo({}, now);
    expect(info.sha).toBeNull();
    expect(info.shortSha).toBeNull();
    expect(info.runUrl).toBeNull();
  });
});
