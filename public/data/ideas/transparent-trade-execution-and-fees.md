---
title: "Transparent trade execution and fees"
domains: finance
desires:
  - investor/fees-i-can-actually-see
---

## Problem

Even onchain, an investor in a tokenized fund or a wrapped asset can pay costs they never see clearly. A fund can skim a management fee that accrues quietly inside the vault, a router can fill an order at a worse venue and pocket the spread, and a wrapper can carry an issuance or redemption charge disclosed once in documentation and then averaged away. This is the same pattern that makes traditional investing opaque, where a "commission-free" trade is paid for by order flow sold to a market maker and an expense ratio is buried in a prospectus, except here the execution actually happens on a public network. The cost is knowable in principle, yet without deliberate design the holder still cannot reconstruct what each layer took on their specific trade.

## Solution

Execution and fees recorded onchain per trade, so a holder can see the price they were filled at, the venue or router that filled it, any rebate or spread it captured, the fund's fee as it accrues, and any issuance or redemption charge, all itemized against each transaction rather than averaged into an annual figure. A workable starting point is one tokenized asset or onchain fund where the routing, the fill price, and the fee taken are emitted as part of settlement, giving the holder a per-trade cost record they can audit themselves. This works only where settlement is already onchain, so the scope stays tokenized funds and assets whose execution is native to the network, not brokered claims that settle where a contract cannot see them.

## Why Ethereum

When the broker, the trading venue, and the fund each keep their own books, the investor sees only the disclosures each party chooses to write, and the real cost stays split across the very parties with an interest in keeping it scattered. Settling execution onchain makes the fill price and every fee taken on a trade a visible property of the transaction itself, so the cost cannot be selectively reported or itemized away by whoever profited from it.
