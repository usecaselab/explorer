<div align="center">

# Use Case Lab

**A curated index of real-world Ethereum use cases.**

[Live site](https://usecaselab.org) · [Browse all ideas](public/data/ideas) · [Add a new idea](https://github.com/usecaselab/explorer/new/main?filename=public%2Fdata%2Fideas%2Fnew-idea.md)

</div>

---

## Want to contribute an idea?

Use Case Lab is a curated index. Every idea here is a markdown file in [`public/data/ideas/`](public/data/ideas) — you contribute by opening a pull request that adds or edits one.

The fastest path is to click **Add Idea** on [the live site](https://usecaselab.org). The form will pre-fill a new file on GitHub — you fill it out, click "Propose new file," and a PR opens automatically. We review it, suggest edits if needed, and merge.

You can also skip the form and add the file directly in the repo:

1. Create `public/data/ideas/<your-slug>.md`
2. Use the format below
3. Open a PR

## How to write a good idea

Each idea is short (3 sections, ~200–800 words total). Treat it as a one-pager for someone who could build it — enough to spark a project, not a spec.

```markdown
---
title: "A short, punchy title"
domains: commerce, finance
---

## Problem

What's broken or missing today. Be specific about *who* this hurts and
*why* the gap exists. Avoid hand-waving ("crypto could fix X"); name the
concrete failure.

## Solution

A sketch of how you'd address it. The shape of the thing, not full
specs. One or two paragraphs at most.

## Why Ethereum

A plain one or two sentence sovereignty analysis of the idea.
Explain how a centralized version would fail the user (who
holds the power, where the chokepoint or conflict of interest
sits) and what building on open, neutral rails changes.
```

### Guidelines we look for in reviews

- **Real problem.** The Problem section should describe a situation that exists today, not a hypothetical. If it could be solved with a normal database, say so and explain why a normal database isn't enough.
- **Specific, not generic.** "Tokenize X" or "decentralize Y" without saying *what changes for whom* won't get merged. Pick a concrete user and walk through what they experience.
- **Why Ethereum, honestly.** The strongest ideas need Ethereum's actual properties (censorship resistance, open source, privacy, security, credible neutrality) in a way a centralized platform can't substitute.
- **Reasonable scope.** One idea per file. If you're describing a whole platform with five sub-products, split it up — or pitch the single most interesting piece.
- **Domain IDs match.** The `domains:` frontmatter values must match the IDs in [`components/IdeaShowcase.tsx`](components/IdeaShowcase.tsx) (the `DOMAIN_CONFIG` keys). Currently: `ai`, `business-operations`, `civil-society`, `commerce`, `environment`, `finance`, `food-and-agriculture`, `government`, `health`, `identity`, `insurance`, `logistics-and-trade`, `media`, `real-estate-and-housing`, `science`, `utilities`. Pick 1–4.

We're not strict about prose style — write like you would in a doc to a colleague. Clear and direct beats clever.

## Editing an existing idea

Every idea page has an **Edit** button that opens that file on GitHub. Click it, make your change, propose the edit, and the same PR flow applies. Typos, broken links, sharper framings — all welcome.

## How it gets onto the site

```
public/data/ideas/*.md  ──build─→  public/ideas.json  ──fetch─→  React SPA
```

When your PR merges into `main`, GitHub Actions rebuilds the site and your idea is live in a couple of minutes. There's no separate review step or moderation queue — merge is the publish.

## Running the site locally (only if you're touching code)

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # outputs static dist/
```

No env vars. No backend. No database. Everything is read from the markdown files at build time.

## Tech stack

React 19 · Vite 6 · TypeScript · Tailwind (CDN) · Three.js / R3F · Lucide icons. Hosted on GitHub Pages.

## License

MIT.
