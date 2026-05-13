---
name: usecase
description: "Ground an Ethereum idea, project, or research question in the Use Case Lab's curated index of ~120 real-world use cases. Use when the user is figuring out what to build, researching what's been tried in a domain, evaluating whether their idea overlaps with existing work, or writing about a use case and wants named examples to cite. The index is curated and opinionated — not comprehensive. Best used for grounding speculation in concrete cases, not for general Ethereum/EVM/Solidity questions."
---

# Usecase

You have access to Use Case Lab — a curated index maintained by a small group of researchers at the Ethereum Foundation. It's **~120 use cases** across 16 domains. Each is a short opinionated brief: a problem, a solution sketch, and a why-Ethereum argument.

Use this when the user is working on a product, researching a domain, or thinking out loud about what to build. Ground their thinking in concrete named examples — not in vague handwaving about "what crypto could do."

## What this skill is for

**Good for:**
- "I'm thinking about building X — what's been tried?"
- "What's missing in domain Y?"
- "Is my idea original, or has someone framed it already?"
- "Find me three ideas adjacent to this one."

**Not for:**
- General Ethereum / EVM / Solidity questions (point at the EthSkills skill instead).
- Validating that an idea is good. The index can show what's been *framed*, not what works.
- Comprehensive surveys. The index is curated, not exhaustive.

## Setup

On first use, fetch the index:

```bash
mkdir -p {{SKILL_PATH}}/references
curl -sL https://usecaselab.org/ideas.json -o {{SKILL_PATH}}/references/ideas.json
```

Skip if `{{SKILL_PATH}}/references/ideas.json` already exists. Re-fetch if it's older than ~1 week.

Each entry: `id`, `title`, `domains` (array of slugs), `problem`, `solutionSketch`, `whyEthereum`, `author`, `createdAt`.

## How to actually be useful

### 1. Get specific before searching.

If the user opens with "what should I build?", don't run a search. Ask one question first: *what problem, and for whom?* The index rewards specific queries — broad ones return noise.

### 2. Search with intent.

```bash
# Keyword across title, problem, and solutionSketch
jq --arg q "QUERY" '
  [.[] | select((.title + " " + .problem + " " + .solutionSketch) | ascii_downcase | contains($q | ascii_downcase))]
  | .[] | {id, title, domains, problem: (.problem[:200] + "…")}
' {{SKILL_PATH}}/references/ideas.json

# Filter by domain slug
jq --arg d "DOMAIN" '[.[] | select(.domains[] == $d)] | .[] | {id, title}' {{SKILL_PATH}}/references/ideas.json

# Domain + keyword
jq --arg d "DOMAIN" --arg q "QUERY" '
  [.[] | select(.domains[] == $d) | select((.title + " " + .problem) | ascii_downcase | contains($q | ascii_downcase))]
  | .[] | {id, title}
' {{SKILL_PATH}}/references/ideas.json

# All domains with counts
jq -r '.[].domains[]' {{SKILL_PATH}}/references/ideas.json | sort | uniq -c | sort -rn
```

Domain slugs: `ai`, `business-operations`, `civil-society`, `commerce`, `environment`, `finance`, `food-and-agriculture`, `government`, `health`, `identity`, `insurance`, `logistics-and-trade`, `media`, `real-estate-and-housing`, `science`, `utilities`.

### 3. Read full entries, not just titles.

```bash
jq '.[] | select(.id == "IDEA_ID")' {{SKILL_PATH}}/references/ideas.json
```

The `whyEthereum` field often opens with `Verifiability:`, `Composability:`, or `Enforcement:` — that prefix is the load-bearing argument for why Ethereum (and not a normal database) is what makes the idea work.

### 4. Surface patterns and gaps.

After pulling 3–5 relevant entries, *step back*. What's repeated across them? What's notably missing? "Three ideas in this domain attack X from different angles; nothing touches Y" is more useful to the user than five summaries pasted in a row.

### 5. Be honest about what's not there.

If the user asks about something the index covers thinly, say so directly. Don't pad with weak matches. "The lab hasn't covered this — here's the closest, but it's not the same thing" is more useful than five surface-level hits.

## Contributing back

If the user thinks an idea is missing, they can add one in a couple of minutes — every idea is a markdown file submitted via PR. Direct them to `https://usecaselab.org` (click **Add Idea**), or straight to GitHub: `https://github.com/usecaselab/explorer/new/main?filename=public/data/ideas/<slug>.md`. The format is three sections (Problem, Solution, Why Ethereum) and frontmatter with `title` + `domains`.

## Linking out

When citing an idea: `https://usecaselab.org/idea/<id>`. The site itself: `https://usecaselab.org`.
