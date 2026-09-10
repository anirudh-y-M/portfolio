import { describe, expect, test } from 'vitest';
import { formatDate, formatMonth, jstClock } from '../../src/lib/dates';

describe('dates', () => {
  const d = new Date('2026-09-10T05:32:00Z'); // 14:32 JST
  test('formatDate', () => expect(formatDate(d)).toBe('10 Sep 2026'));
  test('formatMonth', () => expect(formatMonth(d)).toBe('Sep 2026'));
  test('jstClock converts to Asia/Tokyo', () => expect(jstClock(d)).toBe('14:32'));
});
