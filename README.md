# anirudh-y-m.github.io/real-portfolio

Personal site of Anirudh Yadav, platform engineer in Tokyo.

- Static Astro site. No client-side framework. Every page ships under 5 KB of JavaScript, enforced at build time by `integrations/js-budget.ts`.
- Content lives in `src/content/{work,notes,now}` and is validated by `src/content.config.ts` and `tests/content`.
- A case file publishes only when `draft: false` and `reviewed: true`.
- `npm run build` also fails if any built page still contains a `REPLACE` placeholder token (`integrations/replace-guard.ts`) or if a principle in `src/data/principles.ts` points at a case file that isn't published.

## Develop

    npm install
    npm run dev            # drafts visible
    npm run build          # strict: published entries only; fails on the JS budget, REPLACE tokens, or unpublished principle targets
    npm run build:draft    # same build with ALLOW_PLACEHOLDERS=1 — warns instead of failing on REPLACE tokens and skips the principles check
    npm test               # unit, content lint, Playwright e2e + axe — run `npm run build:draft` (or `build`) first, since test:e2e serves `dist/` via `astro preview`
    npx lhci autorun       # Lighthouse budgets — also needs a build first

GitHub Pages → Settings → Pages → Source must be set to "GitHub Actions" once, so the `deploy` job in `.github/workflows/ci.yml` can publish.

## Write

Start from `content/WORKSHEET.md`. Design notes are local, untracked working notes (the `docs/` directory is git-ignored on purpose and not part of this repo) — see `docs/superpowers/specs/2026-09-10-portfolio-design.md` on this machine.
