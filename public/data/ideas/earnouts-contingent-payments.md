---
title: "Earnouts and contingent payments"
domains: business-operations
desires:
  - founder/pay-for-outcomes
---

## Problem

In a lot of deals, part of the price is paid later, contingent on something happening: an M&A earnout tied to post-close revenue or EBITDA, a milestone holdback released on a regulatory approval or a key hire, a contingent value right that pays out if a clinical trial succeeds, an escrowed indemnity released on a future date. Once the deal closes, the party that owes the contingent payment usually controls the books, the operations, and the timing decisions that determine whether the trigger ever fires. The other side either trusts that accounting or litigates after the fact, and disputes over contingent payments are a common source of post-close conflict.

## Solution

A structure where contingent consideration is escrowed onchain and released according to a pre-agreed payout rule. The rule is tied to an objective metric verified by an agreed source, such as an auditor, payment rail, signed API record, platform usage feed, regulatory milestone, or other third-party attestation. Both sides can see the same rule, the same verification source, and the same payout conditions before closing.

## Why Ethereum

This is useful when the contingent payment depends on a metric both sides can define in advance and verify independently. Instead of leaving the payout entirely dependent on the paying party's later accounting, the parties can escrow funds, commit to a payout rule, and settle automatically when the agreed evidence is submitted. It does not eliminate the need for legal agreements or trusted data sources, but it does reduce post-close discretion, delay, and litigation leverage.
