import { describe, expect, test } from 'vitest';
import { groupByStatus, isPublished, sortNotesNewest, sortWork } from '../../src/lib/content';

const note = (id: string, status: 'seed' | 'growing' | 'evergreen', published: string, updated?: string) =>
  ({ id, data: { status, published: new Date(published), updated: updated ? new Date(updated) : undefined } }) as any;

describe('content helpers', () => {
  test('isPublished requires draft:false and reviewed:true', () => {
    expect(isPublished({ draft: false, reviewed: true })).toBe(true);
    expect(isPublished({ draft: false, reviewed: false })).toBe(false);
    expect(isPublished({ draft: true, reviewed: true })).toBe(false);
  });
  test('sortNotesNewest uses updated over published', () => {
    const a = note('a', 'seed', '2026-01-01');
    const b = note('b', 'seed', '2025-01-01', '2026-06-01');
    expect(sortNotesNewest([a, b]).map((n) => n.id)).toEqual(['b', 'a']);
  });
  test('groupByStatus orders evergreen, growing, seed', () => {
    const groups = groupByStatus([note('s', 'seed', '2026-01-01'), note('e', 'evergreen', '2026-01-01')]);
    expect(groups.map((g) => g.status)).toEqual(['evergreen', 'growing', 'seed']);
    expect(groups[0].entries[0].id).toBe('e');
    expect(groups[1].entries).toHaveLength(0);
  });
  test('sortWork sorts by order then title', () => {
    const w = (id: string, order: number, title: string) => ({ id, data: { order, title } }) as any;
    expect(sortWork([w('b', 2, 'B'), w('a', 1, 'Z'), w('c', 2, 'A')]).map((x) => x.id)).toEqual(['a', 'c', 'b']);
  });
});
