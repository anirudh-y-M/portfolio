import { defineConfig, devices } from '@playwright/test';

// The site is served with `trailingSlash: 'always'` under a `/portfolio`
// base path. `astro preview` does not redirect a bare `/portfolio` (or
// any route missing its trailing slash) to the slashed form — it 404s with
// Astro's own generic error page instead of the site's — so every URL below
// carries its trailing slash to match what the built site actually serves.
const baseURL = 'http://localhost:4321/portfolio/';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --port 4321',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    // `astro preview` auto-detects an AI-agent shell (e.g. this one) and
    // silently daemonizes itself in the background, exiting the spawned
    // process immediately — which Playwright then reports as "exited
    // early". Forcing foreground mode keeps the server attached to the
    // process Playwright manages and tears down after the run.
    env: { ASTRO_PREVIEW_BACKGROUND: '1' },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
