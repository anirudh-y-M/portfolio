import type { AstroIntegration } from 'astro';
import { fileURLToPath } from 'node:url';
import { checkBudget, pageJsTotals } from '../src/lib/js-budget';

export default function jsBudget({ limitBytes = 5120 }: { limitBytes?: number } = {}): AstroIntegration {
  let base = '/';
  return {
    name: 'js-budget',
    hooks: {
      'astro:config:done': ({ config }) => {
        base = config.base;
      },
      'astro:build:done': async ({ dir, logger }) => {
        const totals = await pageJsTotals(fileURLToPath(dir), base);
        const { ok, offenders } = checkBudget(totals, limitBytes);
        // Only finite (locally-resolved) byte counts are meaningful here — an external script
        // is already reported as an offender below via `Infinity`, and letting it through would
        // make this "largest page" log line print `Infinity B` instead of a real number.
        const max = totals.reduce((m, t) => (Number.isFinite(t.bytes) ? Math.max(m, t.bytes) : m), 0);
        logger.info(`largest page ships ${max} B of JavaScript (limit ${limitBytes} B)`);
        if (!ok) {
          for (const o of offenders) {
            const externals = o.externals?.length ? ` externals: ${o.externals.join(', ')}` : '';
            logger.error(`${o.path}: ${o.bytes} B${externals}`);
          }
          throw new Error(`JavaScript budget exceeded on ${offenders.length} page(s)`);
        }
      },
    },
  };
}
