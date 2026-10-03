---
title: "Public procurement lifecycle"
domains: government
desires:
  - civic-participant/verify-public-decisions
---

## Problem

Government procurement runs on opaque bid evaluations, paper-based contract trails, and limited public visibility into who won what and why. A bidder who loses gets a result with no insight into how the evaluation was scored, and the public sees an award announcement long after the decisions that produced it. Because the agency awarding the contract also controls the record of how it ran the tender, favoritism and collusion are hard to detect and harder to prove. Procurement is one of the largest line items in any government budget, which makes this opacity expensive: it is where a large share of public corruption is understood to occur.

## Solution

A procurement record that spans the full lifecycle onchain: the tender, the bids and their timestamps, the evaluation criteria and scores, the award, supplier credentials, deliveries, and payments. Each step is committed as it happens, so a losing bidder can see how the scoring was applied, an auditor can confirm the winning bid actually matched the published criteria, and the link from award to delivery to payment is verifiable rather than taken on the agency's word.

A workable starting point is the sealed-bid stage of a single high-value tender category, where bids are committed onchain before the deadline and revealed together, removing the agency's ability to leak or alter a bid after submission. Evaluation logging, delivery, and payment tracking extend outward from there once the bidding record is trusted.

## Why Ethereum

When the procurement record is held by the same agency awarding the contracts, the office with the most to gain from favoritism is also the one that controls what the public gets to see. Recording the full lifecycle onchain keeps bids, evaluations, and payments outside that agency's editing power, so citizens and auditors can check the process without asking permission.
