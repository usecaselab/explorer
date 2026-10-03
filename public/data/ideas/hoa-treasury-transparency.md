---
title: "Transparent HOA and co-op treasuries"
domains: real-estate-and-housing, civil-society
desires:
  - homeowner/hoa-reserves-i-can-see
---

## Problem

A homeowners' association or housing co-op collects dues every month and runs them through a bank account only the board and its management company can see. Owners get a one-page summary at the annual meeting and a budget vote on figures they cannot independently check, with no way to tell whether the reserve fund is solvent or quietly being drained until a special assessment lands to cover a roof no one was warned about. When a board member or a management firm skims or mismanages the float, the loss surfaces years later, and the owners who funded it have no running record to audit. The people paying the dues have the least visibility into where they go.

## Solution

Hold the association's reserve fund as an onchain account the owners co-control, not just one they can read. The long-term reserve sits in a multi-signature contract whose signing rule follows the bylaws, so a withdrawal needs the keys those rules assign rather than one administrator's say-so, and every owner can watch the balance and each release as it happens. Day-to-day operating spend stays in the existing account, and vendors are still paid in fiat once funds are released. A workable starting point is the reserve alone, the single pot most prone to quiet draining, held under the bylaws' own approval threshold without rebuilding the board's whole bookkeeping. Putting operating dues through the same custody and adding onchain budget votes can follow once the reserve flow is trusted.

## Why Ethereum

A board and its management company control the books, the bank account, and what owners are told about either, so members fund a reserve they have to take on faith and cannot stop from being drained. A read-only report, even one a trustworthy accounting firm publishes, would show the draining but not prevent it. Holding the reserve in a multi-signature contract puts the owners in co-control of the money itself: a withdrawal needs the keys the bylaws assign, not one administrator's signature, and every owner can audit the balance and each release as it happens. The custody outlives whichever board or firm holds office, so a new owner inherits a co-held fund instead of a black box.
