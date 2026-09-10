export const BANNED_WORDS = ['passionate', 'leveraging', 'seamless', 'cutting-edge', 'ninja'] as const;

export function findBannedWords(text: string): string[] {
  const lower = text.toLowerCase();
  return BANNED_WORDS.filter((w) => new RegExp(`\\b${w.replace('-', '[- ]')}\\b`).test(lower));
}

export const REQUIRED_HEADINGS = ['Context', 'Constraint', 'Decision', 'Outcome', 'Retro'] as const;

export function headingOrderErrors(markdown: string): string[] {
  const found = [...markdown.matchAll(/^## +(.+?)\s*$/gm)].map((m) => m[1].trim());
  const errors: string[] = [];
  REQUIRED_HEADINGS.forEach((expected, i) => {
    const actual = found[i];
    if (actual === undefined) errors.push(`missing heading "${expected}"`);
    else if (actual !== expected) errors.push(`expected heading ${i + 1} to be "${expected}", found "${actual}"`);
  });
  return errors;
}
