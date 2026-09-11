module.exports = {
  ci: {
    collect: {
      // Astro's preview server auto-detects when it's run inside an
      // AI-agent shell (via the `am-i-vibing` package) and, when it does,
      // daemonizes itself in the background and exits the foreground
      // process immediately — which LHCI's server-lifecycle management
      // then treats as an early exit and fails to attach. Setting
      // `ASTRO_PREVIEW_BACKGROUND=1` short-circuits that auto-detection and
      // keeps the server in the foreground so LHCI can spawn it, wait for
      // `startServerReadyPattern`, and tear it down normally. It's a no-op
      // in GitHub Actions (or any other non-agent shell), since the
      // auto-detection never fires there and the server is already
      // foregrounded by default.
      startServerCommand: 'ASTRO_PREVIEW_BACKGROUND=1 npm run preview -- --port 4321',
      startServerReadyPattern: 'localhost:4321',
      // Detail routes (e.g. /work/<id>/, /notes/<id>/) should be appended here once content
      // publishes (content/WORKSHEET.md section I) — unlike the Playwright e2e routes, this
      // list is not sitemap-driven and must be updated by hand.
      url: [
        'http://localhost:4321/portfolio/',
        'http://localhost:4321/portfolio/work/',
        'http://localhost:4321/portfolio/notes/',
        'http://localhost:4321/portfolio/about/',
      ],
      numberOfRuns: 2,
      settings: { preset: 'desktop' },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'total-byte-weight': ['warn', { maxNumericValue: 350000 }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
};
