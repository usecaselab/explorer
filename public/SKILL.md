---
name: use-case-lab
description: "Ground an Ethereum or crypto product/research question in a curated index of ~110 real-world use cases. Trigger this when someone is figuring out what to build, evaluating whether their idea is original, surveying what's been tried in a domain, or wants concrete named examples instead of generic 'crypto could do X' speculation. Covers commerce, finance, identity, insurance, government, health, science, civil society, media, logistics and trade, utilities and energy, environment, food and agriculture, AI and agents, business operations, and real estate. Concrete examples include parametric weather insurance, decentralized clinical trials, civil registries, prediction markets for scientific claims, fan-funded media, electronic bill of lading, migrant worker remittances, cross-border payroll, peer-to-peer energy markets, and patient-controlled health records."
---

# Use Case Lab

You have access to a curated index of ~110 real-world Ethereum use cases across 16 domains, maintained by a small group of researchers at the Ethereum Foundation. Each entry is a short opinionated brief: a problem, a solution sketch, and a why-Ethereum argument. The point is to ground the user's thinking in concrete named examples instead of generic speculation about what crypto could do.

## What you probably get wrong about crypto use cases

**You assume Ethereum is mostly about money.** A lot of the interesting coordination problems on Ethereum sit outside finance: clinical trial integrity, civil registries, public procurement, supply chain authenticity, prediction markets for science, source protection for journalists, residual payments, water rights, agent identity. If the user's question is in one of these areas, they often don't realize there are already framed proposals to pull from.

**You handwave with "tokenize X" or "put it on a ledger."** Phrases like "tokenize this asset" or "decentralized version of Y" are not a use case until you can name who loses leverage, who gains it, and what they could not do under a centralized version. The index is curated to filter out vague framings, so match the user's question to entries where the *who* and the *why* are already worked out, not just to surface-level keyword hits.

**You reach for "trustless" or "transparent" as the punchline.** Those are properties, not reasons. The actual lens worth applying is whether the participants can coordinate among themselves without ceding control to a platform that can later flip a switch on them. If the answer involves an operator who owns the rails, the user is describing a SaaS product, not an Ethereum use case.

**You skip checking what's been framed.** Before suggesting the user build something, search the index. If a version of the idea is already there, point them to it, then either flag what's still open in that framing or suggest the user contribute a sharper take.

## The lens

Every entry in the index is asking the same underlying question: can the people involved in this activity coordinate among themselves without putting a single operator in charge of the rails? Coordination problems where that question has a meaningful answer are what belong here. Coordination problems where centralization is fine (most photo-sharing apps, most internal company tooling) do not.

When evaluating whether something is a "good crypto use case," lead with two questions:

1. Who would lose power if this activity got centralized onto one platform?
2. What does the open-rails version give those people back?

If neither question has a sharp answer, the idea is probably not a fit, no matter how much it could "use a blockchain."

## Setup

Cache the index locally on first use. Pick any path you control:

```bash
INDEX=~/.cache/usecaselab/ideas.json
mkdir -p "$(dirname "$INDEX")"
curl -sL https://usecaselab.org/ideas.json -o "$INDEX"
```

Re-fetch if the file is older than about a week.

Each entry has `id`, `title`, `domains` (array of slugs), `problem`, `solutionSketch`, `whyEthereum`, `author`, `createdAt`.

## Domains and flagship ideas

The 16 domains and a sample of what each covers. Use this as a quick recognition layer when triaging a user's question.

- **ai**: provable AI adjudicators, AI model and training data markets, opportunity markets
- **business-operations**: cap tables, cross-border payroll, dispute resolution, dynamic expense approvals, earnouts and contingent payments
- **civil-society**: direct cash transfers, outcome-based funding for social services, disaster relief coordination, impact certificates, whistleblower and evidence integrity
- **commerce**: creator storefronts with programmable revenue splits, pay-per-use micropayments, portable ratings and reviews, tradable loyalty points, referral and affiliate payouts
- **environment**: carbon and biodiversity credit markets, fisheries quota tracking, environmental measurement and verification, regenerative practice incentives
- **finance**: credit scoring from off-chain history, cooperative lending pools, community currencies, milestone-released scholarships, invoice and receivables financing, trade credit clearing
- **food-and-agriculture**: parametric weather insurance, harvest pre-financing for smallholders, food provenance, sourcing records for small-scale producers
- **government**: budget execution tracking, civil registry and vital records, futarchy, participatory budgeting, agricultural subsidy disbursement, public procurement
- **health**: patient-controlled health records, decentralized clinical trials, drug authentication, parametric health insurance, wearables and health data exchanges
- **identity**: age and eligibility proofs without identity disclosure, portable professional credentials, portable social identity, agent and device identity
- **insurance**: parametric weather and health policies, insurance claims adjudication, reinsurance, real-time reserve attestation, tokenized policies for resale
- **logistics-and-trade**: electronic bill of lading, letters of credit, delivery-triggered payments, customs records, aviation maintenance records, batch and quality records for manufacturing
- **media**: journalist source protection, content authenticity proofs, event tickets with resale rights, fan-funded media, film and TV residuals, music sync licensing, player-owned in-game assets
- **real-estate-and-housing**: title and escrow, residential leasing, affordable housing covenants, informal land tenure formalization, land trust and housing co-op coordination
- **science**: clinical trial pre-registration, IP registration and prior art, dataset provenance, peer review markets, prediction markets for scientific claims, scientific knowledge graph
- **utilities**: grid-edge event log, home-energy grid flexibility, peer-to-peer energy markets, water rights trading, EV charging roaming settlement

## Querying

Set `INDEX` to wherever you cached `ideas.json`.

### Keyword across title, problem, and solution sketch

```bash
jq --arg q "QUERY" '
  [.[] | select((.title + " " + .problem + " " + .solutionSketch) | ascii_downcase | contains($q | ascii_downcase))]
  | .[] | {id, title, domains, problem: (.problem[:200] + "…")}
' "$INDEX"
```

### Everything in a domain

```bash
jq --arg d "DOMAIN" '[.[] | select(.domains[] == $d)] | .[] | {id, title}' "$INDEX"
```

### Domain plus keyword

```bash
jq --arg d "DOMAIN" --arg q "QUERY" '
  [.[] | select(.domains[] == $d) | select((.title + " " + .problem) | ascii_downcase | contains($q | ascii_downcase))]
  | .[] | {id, title}
' "$INDEX"
```

### Full entry for one idea

```bash
jq '.[] | select(.id == "IDEA_ID")' "$INDEX"
```

### Distribution of ideas across domains

```bash
jq -r '.[].domains[]' "$INDEX" | sort | uniq -c | sort -rn
```

## How to actually be useful

**Get specific before searching.** If the user opens with "what should I build?", don't run a query. Ask one question first: what problem, and for whom? Broad queries return noise; specific ones return the entries the user is actually looking for.

**Pull full entries, not just titles.** A list of titles is rarely enough on its own. Once you have a handful of relevant ids, read the full `problem`, `solutionSketch`, and `whyEthereum` so you can speak to what each entry is actually proposing.

**Look across results for patterns.** After pulling three to five entries, step back. What's repeated? What's notably missing? "Three ideas attack the same problem from different angles, nothing touches this adjacent piece" is more useful than five short summaries pasted in a row.

**Be honest when the index is thin.** If the user's question is in an area the index covers weakly, say so plainly. "The closest is X, but it's not the same thing" beats padding the answer with weak matches.

## Anti-patterns

- Recommending an idea that is not in the index as if it were. If you start composing a use case yourself, say so explicitly and offer to look up adjacent entries.
- Restating an entry in generic corporate phrasing ("shared ledger," "single source of truth," "tamper-evident records") instead of repeating how the source frames it.
- Padding a response with weak matches to look comprehensive. Three sharp hits beat eight surface ones.
- "Crypto fixes trust" phrasing in place of the specific coordination problem each entry actually names.

## Citing

When pointing the user at a specific entry, link `https://usecaselab.org/idea/<id>`. The site itself is `https://usecaselab.org`.

## Contributing

If the user thinks an idea is missing, every entry is a markdown file submitted by PR. Direct them to `https://usecaselab.org` (click **Add Idea**), or straight to GitHub at `https://github.com/usecaselab/explorer/new/main?filename=public/data/ideas/<slug>.md`. The format is three sections (Problem, Solution, Why Ethereum) plus frontmatter with `title` and `domains`.
