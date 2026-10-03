---
title: "Community risk pools"
domains: insurance
desires:
  - community-organizer/pool-capital-with-peers
---

## Problem

Groups that share one specific risk often cannot buy an affordable policy for it. A fishing cooperative facing boat damage, a community of drivers, or a mutual-aid network covering funeral costs is either declined by commercial carriers as too niche or quoted a premium loaded with heavy margin on top of expected losses. The informal alternative, a pool the members run by hand, depends on whoever holds the cash staying honest and solvent, and when the treasurer disappears or quietly winds the fund down, members who paid in for years have no claim on what is left.

## Solution

A risk pool held as a smart contract that members pay premiums into and that pays claims out by rules the members set and can see. Surplus stays in the pool or returns to members rather than being booked as an outside firm's profit, and the reserve balance, the claims paid, and the approval rules are visible to everyone who contributes. Claims with a clear trigger settle automatically, while contested ones go to a member vote or a small elected committee whose decisions are recorded onchain.

The smallest viable version is a single pool for one well-defined risk among people who already coordinate, such as a cooperative, a union local, or a diaspora group, with a fixed premium, a capped payout, and a transparent reserve. Actuarial pricing and cross-pool reinsurance can come later.

## Why Ethereum

A conventional insurer or a hand-run mutual puts one party in control of the float, the books, and the decision to pay, leaving members to trust that party to price fairly, stay solvent, and not keep the surplus. Holding the pool's reserves and rules onchain keeps the money under the members' collective control, lets any contributor verify what is in the pool and what has been paid, and means the fund outlives whoever administers it. A pool serving a stigmatized or politically inconvenient group also cannot be cut off by a carrier that decides it no longer wants the business.
