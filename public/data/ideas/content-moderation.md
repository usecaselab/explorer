---
title: "Content moderation"
domains: civil-society, media
desires:
  - creator/survive-demonetization
---

## Problem

Every large social platform runs its own moderation: an internal team and a set of opaque ranking models decide what counts as spam, manipulation, or harm, and a creator who gets throttled or removed sees only a one-line notice and a form that disappears into a queue. These systems do not scale to the volume they police, and because the decision sits at a single chokepoint inside one company, they bend easily under political or advertiser pressure. Community-driven approaches like reputation-weighted flagging, verified-human signals, and notes on contested posts work in pilots, but each platform rebuilds them from scratch inside its own walls, so the judgments never travel and no platform can adopt another's. The person whose livelihood depends on reach has no way to see the rule that hit them, let alone contest it.

## Solution

Moderation infrastructure that lives outside any single platform: community-written notes on contested content, reputation-weighted flagging where long-standing accounts carry more signal, and stake-based curation where moderators put tokens at risk on their calls, all recorded onchain so any app can read the same signal instead of building its own stack. Because the reputation, the stakes, and the rules are public, the logic that suppresses a post is inspectable and forkable rather than buried in a private ranking model.

The smallest viable version is a single shared notes-and-flagging layer for one content type, say link spam or coordinated inauthentic posting, that a handful of clients read through a common contract, with one transparent reputation score and a public record of which flags resolved correctly. Full curation markets and cross-platform reputation can follow once the signal proves useful.

## Why Ethereum

When moderation lives inside a single platform, that company alone decides what gets suppressed, and the system is easily captured by political pressure aimed at one chokepoint. Running reputation, stake records, and community notes onchain keeps the moderation signal outside any one company's control, so any platform can read the same signal and the rules behind it are inspectable and forkable by users.
