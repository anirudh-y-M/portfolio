// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import jsBudget from './integrations/js-budget.ts';
import replaceGuard from './integrations/replace-guard.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://anirudh-y-m.github.io',
  base: '/portfolio',
  trailingSlash: 'always',
  compressHTML: true,
  integrations: [sitemap(), jsBudget({ limitBytes: 5120 }), replaceGuard()],
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'IBM Plex Sans',
      cssVariable: '--font-sans',
      weights: ['400 700'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-mono',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],
});
