import type { AstroIntegration } from 'astro';
import { fileURLToPath } from 'node:url';
import { findReplaceTokens } from '../src/lib/replace-guard';

/**
 * Fails a strict build if any built page still contains the literal `REPLACE` placeholder
 * token (content/WORKSHEET.md section I). Set `ALLOW_PLACEHOLDERS=1` (`npm run build:draft`) to
 * downgrade this to a warning — used for previewing, e2e, and Lighthouse runs before the site
 * owner fills in the worksheet.
 */
export default function replaceGuard(): AstroIntegration {
  return {
    name: 'replace-guard',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const offenders = await findReplaceTokens(fileURLToPath(dir));
        if (offenders.length === 0) return;
        const allowPlaceholders = process.env.ALLOW_PLACEHOLDERS === '1';
        const lines = offenders.map((o) => `${o.path}: ${o.count} REPLACE token(s)`);
        if (allowPlaceholders) {
          for (const line of lines) logger.warn(line);
          logger.warn(`${offenders.length} page(s) still contain REPLACE placeholders (ALLOW_PLACEHOLDERS=1 set)`);
          return;
        }
        for (const line of lines) logger.error(line);
        throw new Error(`REPLACE placeholder token found on ${offenders.length} page(s)`);
      },
    },
  };
}
