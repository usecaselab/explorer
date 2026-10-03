---
title: "Price-floor protection for smallholders"
domains: food-and-agriculture, finance, insurance
desires:
  - farmer/get-paid-faster
---

## Problem

A smallholder's income swings with a commodity price set far away, and a price crash between planting and harvest can wipe out a season's margin even when the harvest itself is good. Large farms and traders manage this risk on futures and options markets, but those contracts come in lot sizes worth tens of thousands of dollars and require a brokerage account a smallholder cannot open, so the people most exposed to a price drop have no tool to hedge it. The informal fallback is to sell forward to a buyer who prices in the risk and keeps the upside. As a result a maize or coffee farmer carries price risk they did not choose and cannot lay off, and one bad-price year can undo several good ones.

## Solution

A price-floor contract sized for a single farmer's output: the farmer pays a small premium, and if a public reference price for their crop falls below an agreed floor at harvest, the contract pays the difference automatically, with no claim form and no broker. It works like the parametric weather products some farmers already use, except the trigger is a market price index rather than rainfall. The smallest viable version is one crop with a widely published reference price, sold through a cooperative, with a fixed floor and a capped payout funded by a pool of counterparties willing to take the other side. Finer hedges and a deeper counterparty pool can follow once the simple floor proves farmers will pay for it and the index tracks their realized price closely.

## Why Ethereum

Price hedging for a smallholder fails commercially when it runs through a broker, because the contract sizes, account requirements, and margin that make futures markets work for institutions price out a farmer hedging a few hundred dollars of crop. An onchain contract that settles against a public price oracle lets anyone, anywhere, take the other side of a floor sized to one farm, and it pays on the published number rather than on a counterparty choosing to honor it. That open, neutral settlement is what makes a hedge worth pennies of premium possible at all, and it lets cooperatives and impact funds, not only commercial desks, supply the capital on the other side.
