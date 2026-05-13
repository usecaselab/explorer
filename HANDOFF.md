# Use Case Lab — Maintainer Handoff

## What this is

A static SPA over a folder of markdown. Every idea is a file in `public/data/ideas/`. There's no database, no backend, no auth, no sign-in. All edits and additions flow through GitHub PR review.

- Repo: https://github.com/usecaselab/explorer
- Live: https://usecaselab.org (hosted on GitHub Pages)

## How it works

```
public/data/ideas/*.md  ──build─→  public/ideas.json  ──fetch─→  React SPA
```

- The `.md` files are the source of truth.
- `scripts/build-ideas.mjs` parses them at build time into a single `public/ideas.json`.
- The SPA fetches that JSON once on load.
- The "Submit an Idea" form builds markdown client-side and redirects to GitHub's prefilled new-file URL — the visitor opens a PR with their own GitHub account.
- "Edit on GitHub" on each idea page sends visitors to GitHub's edit-file URL for that `.md`.
- A maintainer reviews and merges the PR. The next push to `main` rebuilds and redeploys.

## Repo layout

```
App.tsx, index.tsx, index.html, utils.ts   # SPA entry + shared
components/                                # 6 components (IdeaShowcase, IdeaPage, Shape3D, SubmitIdeaModal, ToolkitPage, Shape3D)
lib/                                       # api.ts (static JSON fetch) + useEscapeKey.ts
scripts/build-ideas.mjs                    # markdown → JSON build step
public/data/ideas/*.md                     # 122 curated ideas (source of truth)
public/about/                              # Static About sub-site (Argentina Onchain, Commerce, …)
public/verifiable-cities/                  # Static Verifiable Cities sub-site
.github/workflows/pages.yml                # Build + deploy to GH Pages on push to main
```

## Run locally

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # outputs dist/, fully static
pnpm preview      # serves dist/ locally
```

No env vars. No services to start. No DB.

## Deploy

GitHub Actions builds and deploys on every push to `main` via `.github/workflows/pages.yml`. To bootstrap:

1. Repo Settings → Pages → Source: "GitHub Actions"
2. For a custom domain: add a `CNAME` file in `public/` containing the domain (e.g. `usecaselab.org`), and configure the DNS A/CNAME records per GitHub's docs.

## Add or edit an idea

Two paths, both end in a PR:

- **From the live site**: click "Submit an Idea" → fill the form → "Open pull request on GitHub" → GitHub opens prefilled → click "Propose new file".
- **Direct in repo**: add `public/data/ideas/<slug>.md` with the frontmatter format below and open a PR.

For edits: click "Edit on GitHub" on any idea page (or just edit the `.md` in the repo).

### Markdown format

```markdown
---
title: "Short, punchy title"
domains: commerce, finance
---

## Problem

What's broken today.

## Solution

How you'd fix it. Sketch the shape, not full specs.

## Why Ethereum

Verifiability, composability, neutrality, enforcement — what does Ethereum bring that nothing else does. Optionally lead with a one-word capability badge like `Verifiability:` to render a colored chip.
```

Domain IDs must match keys in `components/IdeaShowcase.tsx → DOMAIN_CONFIG`. Adding a new domain means editing that config too.

## What's intentionally NOT here

- **No auth** — no sign-in, no OAuth, no sessions. Anyone can submit by virtue of having a GitHub account.
- **No database** — content lives in markdown, period. No SQLite, no Postgres, no DynamoDB.
- **No backend** — no Express, no API routes, no serverless functions.
- **No admin UI** — admin = repo write access. Approve = merge. Reject = close.
- **No voting / "working on" / community signals** — this is a curated index, not a community platform.
- **No env vars** — there's nothing to configure at runtime.

If you find yourself reaching for any of the above, reconsider — the entire architectural shape is built around their absence. The cost of adding one back is high (you re-introduce ops, secrets, abuse vectors); the benefit is usually marginal.

## Tech stack

React 19, TypeScript, Vite 6, Tailwind via CDN, Three.js / R3F (3D shapes), Lucide icons. That's it.

## When things break

| Symptom | Look at |
|---|---|
| Ideas don't appear after editing `.md` | The build step. Re-run `pnpm build` (or push and let CI rebuild). |
| New idea has a `.md` but doesn't show | Check the frontmatter parses — `pnpm build:ideas` should report 122+1 = 123 ideas. |
| GitHub Pages serves stale | Re-run the workflow manually from Actions tab, or push an empty commit. |
| Hard-refresh on `/idea/foo` shows 404 | `dist/404.html` should be a copy of `index.html` (the build does this). If not, check the `cp` step in the `build` script. |
| 3D shapes don't render | WebGL not available in the browser, or `three` chunk failed to load. Check console. |

## Hand-off origin

This codebase was an Express + SQLite + Better Auth + admin-UI application until **May 2026**, when it was reduced to a pure static SPA with PR-driven curation. The previous architecture supported voting, "working on" signals, user-submitted ideas with an admin approval queue, and OAuth sign-in. All of that was deleted intentionally — see the markdown-only commits in `main` history for the rationale.

Don't restore any of it without a clear product reason. The current shape is the intended one.
