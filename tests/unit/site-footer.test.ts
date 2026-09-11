import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { afterEach, beforeEach, expect, test } from 'vitest';
import SiteFooter from '../../src/components/SiteFooter.astro';

const ENV_KEYS = ['GITHUB_SHA', 'GITHUB_SERVER_URL', 'GITHUB_REPOSITORY', 'GITHUB_RUN_ID'] as const;
let originalEnv: Record<string, string | undefined> = {};

beforeEach(() => {
  originalEnv = {};
  for (const key of ENV_KEYS) originalEnv[key] = process.env[key];
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    const value = originalEnv[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

test('SiteFooter shows commit, build date, budget statement, and source link', async () => {
  process.env.GITHUB_SHA = '0123456789abcdef';
  process.env.GITHUB_SERVER_URL = 'https://github.com';
  process.env.GITHUB_REPOSITORY = 'anirudh-y-M/portfolio';
  process.env.GITHUB_RUN_ID = '7';
  const c = await AstroContainer.create();
  const html = await c.renderToString(SiteFooter);
  expect(html).toContain('0123456');
  expect(html).toContain('href="https://github.com/anirudh-y-M/portfolio/commit/0123456789abcdef"');
  expect(html).toContain('href="https://github.com/anirudh-y-M/portfolio/actions/runs/7"');
  expect(html).toMatch(/under 5 KB of JavaScript/);
  expect(html).toContain('<footer');
});

test('SiteFooter degrades without CI env', async () => {
  delete process.env.GITHUB_SHA;
  delete process.env.GITHUB_RUN_ID;
  const c = await AstroContainer.create();
  const html = await c.renderToString(SiteFooter);
  expect(html).toContain('local build');
});
