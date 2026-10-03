---
title: "Cooperative lending and liquidity pools"
domains: finance, civil-society
desires:
  - community-organizer/pool-capital-with-peers
---

## Problem

Small businesses, credit unions, and cooperatives each hold cash buffers against the chance that several members need liquidity at the same time, and that idle cash is expensive to keep. The usual way to share that risk is to route it through a bank or a fintech platform that pools the reserves, sets the terms of access, and charges for the service. A small co-op is too small to negotiate good terms, so it either overpays or simply keeps more cash on hand than it needs. When the platform changes its fees or freezes access, the members who funded the pool have no recourse and no clear view of where their money sits.

## Solution

A lending and liquidity pool held as a smart contract that members pay into and draw from under rules they set together. Contribution limits, who can borrow, at what rate, and how surplus is shared are written into the contract and visible to every member, so the savings a bank or platform would otherwise book as margin stay with the people who funded the pool. A member short on cash can draw against the shared reserve and repay on a schedule everyone can see, and the pool keeps running without a custodian deciding who gets access.

A workable starting point is one closed group that already trusts each other, a single credit union or a small federation of co-ops, with a fixed contribution, a capped draw, and a transparent reserve. Cross-pool liquidity sharing and formal credit lines can come later.

## Why Ethereum

Pooling reserves through a bank or platform means an intermediary holds the pooled funds, sets the terms of access, and can freeze the pool or close it, while members have to trust its accounting. Running the pool onchain keeps the capital and its rules with the members who contributed it, and gives every participant an audit trail they can check themselves.
