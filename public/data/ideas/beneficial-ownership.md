---
title: "Business registries and beneficial ownership"
domains: government, business-operations
desires:
  - civic-participant/verify-public-decisions
---

## Problem

Verifying a company's registration, licensing status, or true ownership means navigating multiple disconnected databases, often one per jurisdiction, that do not talk to each other. Existing beneficial ownership registries rely on self-reported filings with no verification mechanism, so a layered structure of shell companies across several countries can hide the real owner of an asset behind entities that each look legitimate in isolation. This opacity is systematically exploited for money laundering, sanctions evasion, and tax fraud, and the investigators trying to pierce it depend on slow, case-by-case cooperation between registries that each answer to a different government.

## Solution

Beneficial ownership recorded as cryptographically signed attestations that chain a legal entity to its verified ultimate owners, so the link between a company in one jurisdiction and the person controlling it from another is checkable in a single step rather than reconstructed across bilateral data requests. A bank, regulator, or counterparty verifies the signatures directly instead of trusting a self-filed PDF, and a change in ownership leaves a record no single registry can quietly revise.

The smallest viable version is one high-value chokepoint where verification already matters and parties already cooperate, such as the ownership attestations required to open a corporate bank account or bid on a public contract. Start by anchoring the attestations issuers already produce, then widen coverage across registries and asset classes as more jurisdictions sign on.

## Why Ethereum

Ownership registries today sit inside individual governments, so verification across borders depends on slow cooperation and a registry can be pressured to obscure who really controls an asset. A neutral onchain register lets banks, regulators, and counterparties check signed ownership attestations directly, without trusting any one jurisdiction to keep its records honest or to share them.
