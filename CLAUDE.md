# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install          # install (pnpm only — lockfile is pnpm-lock.yaml)
pnpm dev              # http://localhost:3000 (rebuilds ideas.json first)
pnpm build            # static output to dist/
pnpm preview          # serve dist/
pnpm build:ideas      # markdown → public/ideas.json (run standalone if needed)
```

No env vars. No backend to start. No database. The build step has a hard dependency on git: `scripts/build-ideas.mjs` and `vite.config.ts`'s `lastUpdatedPlugin` both shell out to `git log` to derive timestamps, so a shallow / non-git checkout will produce a build with missing dates (CI uses `fetch-depth: 0`).

## Architecture

```
public/data/ideas/*.md  ──pnpm build:ideas──→  public/ideas.json  ──fetch──→  React SPA
```

The markdown files in `public/data/ideas/` are the source of truth. `scripts/build-ideas.mjs` parses them at build time into a single `public/ideas.json` that the SPA fetches once (cached in `lib/api.ts`). The "Add Idea" form (`components/SubmitIdeaModal.tsx`) builds markdown client-side and redirects to GitHub's prefilled new-file URL — the visitor opens the PR on their own account. There is no submission endpoint.

### Routing (no router library)

`App.tsx` implements client-side routing by hand with `window.history.pushState` + a `popstate` listener and a `parseRoute()` function. Routes: `/`, `/idea/:id`, `/toolkit`, `/rfps`, `/rfp/:id`. `dist/404.html` is a copy of `index.html` so GitHub Pages routes deep links back to the SPA (the build script does the `cp`).

### Stateful navigation between home and idea pages

This is the load-bearing piece of `App.tsx` UX. When the user opens an idea, the home view (`<IdeaShowcase>`) is **kept mounted** and hidden with the `hidden` Tailwind class — not unmounted. This preserves the showcase's internal state (active category, pagination, the shuffled idea order, scroll position within the grid). `savedHomeScrollRef` captures `window.scrollY` at the moment of navigation; a `useLayoutEffect` on route change restores it before paint. `cameFromInternalRef` picks between `history.back()` (in-app nav, avoids piling extra `/` entries onto history) and `navigateHome()` (deep-link fallback).

If you add new top-level routes or restructure the main content area, preserve the "keep showcase mounted, hide via CSS" pattern — re-mounting it loses the user's place.

### Sticky header + sticky category carousel

`App.tsx` measures the header's `offsetHeight` via `ResizeObserver` and publishes it as `--sticky-header-h` on `documentElement`. `IdeaShowcase.tsx`'s `CategoryCarousel` reads that variable for its own `position: sticky; top: var(--sticky-header-h)` so it pins directly beneath the search bar across breakpoints. The showcase `<section>` has `min-h-screen` so that filtering to a small set of results still leaves enough scroll room for the user's scroll position to land at "carousel pinned" instead of being clamped back to a hero-visible view.

### Domain config — single source of truth

`DOMAIN_CONFIG` in `components/IdeaShowcase.tsx` defines all 16 domain IDs, labels, colors, and 3D shapes. The `domains:` frontmatter in every idea `.md` must match these IDs. Adding a domain = edit `DOMAIN_CONFIG`. Don't duplicate this list elsewhere.

### Shape3D / WebGL

`components/Shape3D.tsx` renders one `<Canvas>` per visible card. Each Canvas is its own WebGL context; the comment in that file flags the browser cap (~16 in Chrome, ~8 in Safari), which is why `IntersectionObserver` with `rootMargin: '150px'` gates mounting. If you increase how many shapes render at once, watch for "context lost" / broken-image artifacts on Safari.

### Static sub-sites under `public/`

`public/about/` and `public/verifiable-cities/` are self-contained static sites (each with its own `index.html`). `vite.config.ts`'s `staticMirrorsPlugin` intercepts dev-server requests for those paths so Vite doesn't fall through to the SPA shell. If you add more sub-sites, add their top-level folder name to `mirroredRoots`.

## What is intentionally NOT here

This codebase was an Express + SQLite + Better Auth + admin-UI app until it was reduced to a pure static SPA with PR-driven curation. The following are deliberately absent and should not be re-introduced without a clear product reason:

- No auth (no sign-in, OAuth, sessions)
- No database (markdown is the store)
- No backend / API routes / serverless functions
- No admin UI (admin = repo write access; approve = merge)
- No voting, "working on", or community signals — this is a curated index, not a platform
- No env vars

If you find yourself reaching for any of these, reconsider. The current shape is the intended one; adding them back re-introduces ops, secrets, and abuse vectors with usually marginal benefit.
