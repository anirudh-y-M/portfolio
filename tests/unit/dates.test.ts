import { describe, expect, test } from 'vitest';
import { formatDate, formatMonth, jstClock, periodEndYear } from '../../src/lib/dates';

describe('dates', () => {
  const d = new Date('2026-09-10T05:32:00Z'); // 14:32 JST
  test('formatDate', () => expect(formatDate(d)).toBe('10 Sep 2026'));
  test('formatMonth', () => expect(formatMonth(d)).toBe('Sep 2026'));
  test('jstClock converts to Asia/Tokyo', () => expect(jstClock(d)).toBe('14:32'));
});

describe('periodEndYear', () => {
  test('a single year', () => expect(periodEndYear('2026')).toBe(2026));
  test('a year range returns the later year', () => expect(periodEndYear('2025 – 2026')).toBe(2026));
  test('a range ending in a non-numeric word returns the last numeric year', () =>
    expect(periodEndYear('2026 – Present')).toBe(2026));
  test('no four-digit year returns undefined', () => expect(periodEndYear('ongoing')).toBeUndefined());
});
