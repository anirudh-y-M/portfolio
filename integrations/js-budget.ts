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
        const max = totals.reduce((m, t) => Math.max(m, t.bytes), 0);
        logger.info(`largest page ships ${max} B of JavaScript (limit ${limitBytes} B)`);
        if (!ok) {
          for (const o of offenders) logger.error(`${o.path}: ${o.bytes} B`);
          throw new Error(`JavaScript budget exceeded on ${offenders.length} page(s)`);
        }
      },
    },
  };
}
