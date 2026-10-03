---
title: "Ad delivery and influencer metrics"
domains: commerce
desires:
  - creator/paid-for-value-i-drive
---

## Problem

A brand that pays a creator $20,000 for a sponsored campaign sees only the figures the platform and the influencer choose to show: a follower count, an impression total, an engagement rate, all of which can be inflated with purchased followers and bot traffic the buyer has no way to separate from real reach. Programmatic ad budgets have the same problem one layer down, where the ad network both serves the impression and reports on whether a human ever saw it, and the audits a network commissions tend to confirm the network's own numbers. The Association of National Advertisers has put avoidable digital-ad waste in the tens of billions of dollars a year, and the party best placed to fix it is the one being paid by the inflated count. The brand carries the loss while the platform keeps the spend either way.

## Solution

Measure delivery against a record the advertiser can audit rather than one the seller controls. Each impression or engagement event is committed onchain as it happens, so the buyer counts the same events the network bills for, and audience-size claims can be backed by zero-knowledge proofs that confirm a follower count or unique-reach figure without exposing the underlying user list. A brand reconciles what it paid for against an independent log instead of accepting a dashboard export it cannot check.

A workable starting point is a single influencer campaign with a fixed deliverable: post reach and engagement committed to a public record at the time of posting, settling the creator's fee against figures both sides agreed to read the same way. Full programmatic display, with its many intermediaries, can follow once the measurement primitive is proven on the simpler case.

## Why Ethereum

Ad fraud persists because the ad network reports on its own delivery, and any auditor it hires can be acquired or pressured by the platform it is supposed to check. Recording delivery onchain that no participant controls gives advertisers a measurement they can verify independently and prevents the network from revising the numbers afterward.
