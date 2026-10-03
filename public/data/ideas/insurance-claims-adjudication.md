---
title: "Insurance claims adjudication"
domains: insurance
desires:
  - patient/appeal-automated-decisions
  - shopper/enforceable-contracts
---

## Problem

Insurance companies face hundreds of disputed claims a month that do not fit automated processing rules. These are the ambiguous coverage questions, the contested damage assessments, and the cases with conflicting evidence, and carriers route them through traditional arbitration that takes 7 to 10 days, costs hundreds of dollars per case, and produces outcomes neither party finds credible. The claimant has no way to see whether the panel deciding the case was genuinely independent of the insurer paying for it.

## Solution

Specialized juror pools that evaluate disputed claims using standardized evidence packages and a structured deliberation protocol. Jurors stake tokens on their verdicts, the outcome is set by stake-weighted consensus, and payment executes automatically once adjudication is complete, so a juror who decides carelessly or in bad faith loses stake and a claimant can see the same rules and record the insurer does.

A workable starting point is one high-volume, low-ambiguity claim type where the dispute is mostly factual rather than legal, such as contested auto damage or a delayed-baggage payout. The first version needs only a fixed evidence template, a juror pool with staked deposits, and an escrow that releases the agreed payout on the verdict, leaving complex coverage-law disputes with the courts.

## Why Ethereum

When an insurer runs or hires the body that adjudicates its own disputed claims, the party with the conflict of interest controls the process, and the claimant has little way to know the deliberation was fair. Building adjudication onchain keeps the juror rules and the record of each verdict verifiable by both sides, so the outcome does not depend on trusting a panel the insurer can influence.
