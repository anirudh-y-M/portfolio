import { describe, expect, test } from 'vitest';
import { findBannedWords, headingOrderErrors } from '../../src/lib/copy-lint';

describe('findBannedWords', () => {
  test('finds banned words case-insensitively', () => {
    expect(findBannedWords('We are Passionate about seamless delivery.')).toEqual(['passionate', 'seamless']);
  });
  test('returns empty for clean copy', () => {
    expect(findBannedWords('Cut build time from 14 to 4 minutes.')).toEqual([]);
  });
});

describe('headingOrderErrors', () => {
  const good = `## Context\n\nx\n\n## Constraint\n\nx\n\n## Decision\n\nx\n\n## Outcome\n\nx\n\n## Retro\n\nx\n`;
  test('accepts the canonical order', () => {
    expect(headingOrderErrors(good)).toEqual([]);
  });
  test('reports missing and out-of-order headings', () => {
    const bad = `## Context\n\n## Decision\n\n## Constraint\n\n## Outcome\n`;
    expect(headingOrderErrors(bad)).toEqual([
      'expected heading 2 to be "Constraint", found "Decision"',
      'expected heading 3 to be "Decision", found "Constraint"',
      'missing heading "Retro"',
    ]);
  });
  test('ignores H3 and deeper', () => {
    expect(headingOrderErrors(good + '\n### Detail\n')).toEqual([]);
  });
  test('reports an extra H2 beyond the fifth', () => {
    expect(headingOrderErrors(good + '\n## Bonus\n')).toEqual(['unexpected extra heading "Bonus"']);
  });
});
