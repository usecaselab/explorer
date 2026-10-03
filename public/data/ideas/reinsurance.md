---
title: "Reinsurance"
domains: insurance
desires:
  - investor/access-gated-markets
---

## Problem

Reinsurance capital is locked behind opaque, relationship-driven markets accessible only to large institutional players, with high intermediation costs and no way for cedents or investors to independently audit counterparty exposure or track payout obligations in real time.

## Solution

A reinsurance protocol where cedents and capital providers transact directly. Risk tranches are tokenized, payouts settle automatically when a loss event is verified, and reserve levels and counterparty exposure update onchain as positions change. Any participant can audit positions and obligations in real time, rather than waiting on quarterly disclosures and rating-agency snapshots.

A workable starting point is a single parametric line where the loss trigger is objective and externally verifiable, such as catastrophe cover keyed to a named windstorm or earthquake threshold. Fully collateralized tranches against one defined event let capital providers and a cedent transact and settle on a clear rule before the harder work of modeling correlated or judgment-based losses across a whole book.

## Why Ethereum

Reinsurance today is intermediated through a small set of brokers, and a cedent's view of a counterparty's book comes from quarterly financials and ratings rather than the live state of its positions. Settling it onchain keeps reserve levels and obligations verifiable by every participant in real time, and lowers the access threshold for new capital providers and smaller cedents to take part.
