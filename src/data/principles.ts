/**
 * Five operating principles. Each must be something a reasonable engineer could
 * disagree with, and each links to the case file that shows it in practice.
 * These are DRAFTS. Anirudh rewrites them in his own words in Task 4.
 */
export const principles: { text: string; work: string }[] = [
  { text: 'Boring on purpose. The platform should be the least interesting thing in the room.', work: 'buildkit-fleet' },
  { text: 'A golden path only counts if it is the easiest path.', work: 'datadog-reference-service' },
  { text: 'Measure before and after, or it did not happen.', work: 'buildkit-fleet' },
  { text: 'Prefer a two-line change in a shared template to a new tool.', work: 'buildkit-fleet' },
  { text: 'Security that people route around is not security.', work: 'mcp-oauth' },
];
