---
title: "Food provenance and traceability"
domains: food-and-agriculture, logistics-and-trade
desires:
  - manufacturer/prove-my-product-is-genuine
  - shopper/verify-what-im-buying
---

## Problem

When a foodborne illness outbreak is traced to a product, public health agencies and retailers often need days or weeks to find which lots are contaminated, because every handoff between grower, packer, distributor, and retailer reassigns its own lot codes and keeps records in a system that does not talk to the others. In the 2018 romaine outbreaks, regulators pulled all romaine from shelves nationwide because they could not isolate the affected farms fast enough. The cost of that delay falls on consumers who get sick, on growers whose clean product is dumped alongside the contaminated, and on retailers who lose a whole category. The gap exists because no single party owns the end-to-end record, and the records that trace a problem back to a given supplier are held by that supplier.

## Solution

A lot identifier that persists across every handoff, so each actor appends its step (received this lot, combined it with these others, shipped it here) to a record keyed to the original harvest rather than re-coded at each stop. A retailer scanning a package can then trace it to the field and harvest date in seconds, and a recall can target the exact lots in circulation instead of clearing an entire category. The smallest viable version is one high-risk product (leafy greens, ground beef, shellfish) moving through a single distributor, recording just the handoff events and the source lot, with existing barcodes carrying the key. Ingredient-level traceability across processed foods can follow once the chain proves the recall-time savings on a product where outbreaks are frequent and costly.

## Why Ethereum

A traceability platform run by the largest retailer or distributor in a chain lets that operator decide who sees the history and gives it room to quietly revise records that trace a contamination back to its own suppliers. The growers and small packers upstream have little reason to feed data into a system their biggest customer controls and could use against them. Recording each handoff onchain keeps the history outside any single company's control, so a regulator, a competitor, or a shopper can trace a lot and catch fraud without the host's permission.
