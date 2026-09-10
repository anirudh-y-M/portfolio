# Content worksheet

Answer in plain sentences. Numbers beat adjectives. If a number is sensitive, use a percentage
and the word "roughly". Do not name internal systems that are not already public (spec §7).

## A. Headline (pick one, or write a better one in the same shape)

1. I build the paved road other engineers ship on.
2. Platform engineer. I make deploying boring.
3. I run the build and deploy path for Mercari's Japan microservices.

Rule: no adjectives about yourself. Name the job.

## B. Status strip "Now" line (≤ 80 chars, present tense)

What are you building this quarter? Example shape: "shipping build-cache fleet v2".

## C. Bio for /about (100–150 words)

Answer, then stitch:
- What do you do all day, in one sentence a non-engineer could follow?
- Where did you work before, and what did you carry from each place?
- What kind of problems do you want more of?
- One personal line (where you live, one thing you do outside work).

## D. Case files (write three, pick the best three as featured)

For each:
- Title as an outcome: "Cut X from A to B" or "Moved N services to Y".
- Summary, ≤ 160 chars.
- Context: what was true before, in two sentences.
- Constraint: what would have happened if nothing changed, and what you could not change.
- Decision: what you did and the one alternative you rejected.
- Outcome: before/after with the measurement method and window.
- Retro: one thing you would do differently.
- Stack: up to 8 nouns.
- Links: public repo, blog post, or talk. Omit if none.

Candidates from your public GitHub: docker-buildkit-fleet, datadog-proj, mcp-oauth / central-mcp-server.
Add one Mercari platform project at the public level of detail.

## E. Principles (five)

Each must be one sentence and something a good engineer could argue with.
Each must point to a case file that demonstrates it.
Drafts are in `src/data/principles.ts`. Rewrite them in your voice.

## F. Notes (start with three)

Source: your `knowledge_markdowns` repo. Rewrite, do not paste. 150–400 words each.
Set status honestly: seed (first thoughts), growing (used it twice), evergreen (would defend it).

## G. Contact

Personal email address. LinkedIn URL. Keep GitHub.

## H. Disclosure check (tick before setting reviewed: true)

- [ ] No internal hostnames or unpublished service names
- [ ] No incident details tied to a date
- [ ] Numbers are public or relative
- [ ] Would be comfortable if a Mercari colleague read it

## I. When you are done

Once every section above is answered and checked, do the following in the repo so the
tests pass and the content publishes:

- [ ] Fill `email` and `linkedin` in `src/data/site.ts` (leave `github` as is)
- [ ] Replace every `REPLACE` token in `src/content/**` and `src/pages/about.astro`
- [ ] Rewrite `src/data/principles.ts` in your own words — five items, each pointing at a work id
- [ ] Set `featured: true` with `order` 1–3 on exactly three case files
- [ ] After the section H disclosure check passes for a file, set `reviewed: true` then `draft: false` for it
- [ ] In `tests/content/collections.test.ts`, change the two `test.skip(` calls to `test(`
      (the "placeholders are filled" test body should become:
      `expect(site.email).not.toMatch(/REPLACE|example\.com/); expect(site.linkedin).not.toMatch(/REPLACE/);`)
- [ ] Run `npm test` and `npm run build`
- [ ] Commit as `content: write case files, notes, now, principles, and bio`
