---
title: "Trade credit clearing"
domains: finance, business-operations
desires:
  - manufacturer/settle-net-without-a-bank
  - manufacturer/procurement-that-reconciles-itself
---

## Problem

Businesses extend credit to one another constantly: a supplier ships now and invoices net-60, its customer does the same with its own customers, and chains of "I will pay you when they pay me" build up across a network. Much of this debt is circular, where A owes B, B owes C, and C owes A, so a large share of it could cancel out with no cash moving at all. But each firm sees only its own bilateral relationships, so nobody can spot the loop, and everyone borrows working capital to bridge invoices that net to far less. The cash locked in those receivables chains is real money small firms pay interest to substitute for.

## Solution

A clearing system where firms register their outstanding obligations to one another and a netting process cancels the circular debt, so a loop in which A owes B, B owes C, and C owes A settles down to the small net balance that actually remains. Each firm watches its position update against a record all participants share, rather than trusting a private operator's books, and only the leftover net balances settle in cash, in stablecoin if the group chooses, freeing the working capital firms would otherwise borrow to bridge the gap.

A workable starting point is one trade association or supply-chain cluster whose members already invoice each other heavily, running periodic netting rounds over a fixed set of registered invoices. Multi-currency settlement, financing of the residual balances, and links between clusters can come later.

## Why Ethereum

A clearing operator that sees every firm's receivables holds a detailed map of who owes whom, and it can prioritize certain members, set the fees, or exclude competitors from the netting. Running the obligations onchain keeps the record out of any single firm's hands, so SMEs can net circular debt without handing a private intermediary leverage over their cash flow. Because the residual settles in the same place the netting is computed, on agreed rules, no operator sits on the pooled cash between netting and payout or decides who is allowed into the network.
