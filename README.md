# anirudh-y-M.github.io/real-portfolio

Personal site of Anirudh Yadav, platform engineer in Tokyo.

- Static Astro site. No client-side framework. Every page ships under 5 KB of JavaScript, enforced at build time by `integrations/js-budget.ts`.
- Content lives in `src/content/{work,notes,now}` and is validated by `src/content.config.ts` and `tests/content`.
- A case file publishes only when `draft: false` and `reviewed: true`.

## Develop

    npm install
    npm run dev          # drafts visible
    npm run build        # published entries only; fails if a page exceeds the JS budget
    npm test             # unit, content lint, Playwright e2e + axe
    npx lhci autorun     # Lighthouse budgets

## Write

Start from `content/WORKSHEET.md`. Design notes are local, untracked working notes (the `docs/` directory is git-ignored on purpose and not part of this repo) — see `docs/superpowers/specs/2026-09-10-portfolio-design.md` on this machine.
