import { describe, expect, test } from 'vitest';
import { href } from '../../src/lib/href';

describe('href', () => {
  test('prefixes base and adds trailing slash', () => {
    expect(href('/work', '/real-portfolio')).toBe('/real-portfolio/work/');
  });
  test('root with base has trailing slash', () => {
    expect(href('/', '/real-portfolio')).toBe('/real-portfolio/');
  });
  test('root with empty base stays "/"', () => {
    expect(href('/', '/')).toBe('/');
  });
  test('file paths (last segment has a dot) get no trailing slash', () => {
    expect(href('/rss.xml', '/real-portfolio')).toBe('/real-portfolio/rss.xml');
  });
  test('is idempotent when a trailing slash is already present', () => {
    expect(href('/work/', '/')).toBe('/work/');
  });
  test('re-appends a hash fragment after the trailing slash', () => {
    expect(href('/#contact', '/real-portfolio')).toBe('/real-portfolio/#contact');
  });
  test('re-appends a query string after the trailing slash', () => {
    expect(href('/work?tab=all', '/real-portfolio')).toBe('/real-portfolio/work/?tab=all');
  });
});
