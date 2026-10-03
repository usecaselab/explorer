---
title: "Agent wallets with enforceable spending limits"
domains: ai, finance
desires:
  - founder/spend-controls-that-enforce-themselves
---

## Problem

AI agents are starting to transact on their own: booking travel, paying for API calls and compute, restocking supplies, settling small invoices. But an agent is not a legal person, so it cannot hold a bank account or a card in its own name. In practice developers wire agents to a human's card or to a custodial balance the platform controls, which means a buggy or prompt-injected agent can run up charges the owner only discovers after the fact, and the platform holding the funds can freeze or claw back whatever the agent does. There is no clean way today to hand an agent a fixed budget it literally cannot exceed and that the owner can audit spend by spend.

## Solution

Give each agent a smart-contract wallet whose spending rules are enforced onchain rather than by the platform running the agent. The owner funds it with a capped budget and sets policy in code: a per-transaction limit, a daily ceiling, an allowlist of payees, an expiry, and a revocation key the owner alone holds. The agent signs payments, but the wallet rejects anything outside the rules, so a compromised or misaligned agent cannot exceed the budget it was given, and every spend is visible to the owner as it happens.

The smallest viable version is a single agent paying a short allowlist of metered services, such as inference APIs and compute, from a wallet with a hard daily cap and an owner kill switch. Richer policies, multi-agent budgets, and per-request streaming payments can come later.

## Why Ethereum

A custodial version puts the platform back in control of the agent's money: it decides whether to honor a payment, can freeze the balance, and asks the owner to trust that the limits are actually enforced. Banks and card networks will not issue an account to a piece of software in the first place, so without permissionless rails an autonomous agent cannot hold value at all. A smart-contract wallet keeps the funds in the owner's self-custody, enforces the spending limits in code anyone can read, and lets the owner verify and revoke without a provider's cooperation, so the constraints on an agent are a property of the money rather than a promise from whoever hosts it.
