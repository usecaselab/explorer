---
title: "Digital product passports"
domains: environment, logistics-and-trade
desires:
  - manufacturer/prove-my-product-is-genuine
  - shopper/verify-what-im-buying
---

## Problem

The EU's Ecodesign for Sustainable Products Regulation (ESPR) mandates digital product passports for most goods sold in Europe by 2030. No neutral infrastructure exists for brands, recyclers, and regulators across a supply chain to read and write to a common product record. Without it, origin and certification claims rely on paper trails that can be forged at every handoff, recycled materials lose their provenance once they re-enter supply chains, and secondhand buyers have no trustworthy way to verify repair history or remaining lifecycle value.

## Solution

Give each product an append-only onchain record that persists through every ownership transfer and material handoff, capturing origin, certifications, condition, repair history, and end-of-life status. Any manufacturer, recycler, regulator, or secondhand buyer can read it from the same place, and each party writes only the entries it is authorized to sign, so a recycled-content or repair claim carries the signature of whoever attested it rather than a brand's self-report.

The smallest viable version is one product category with a clear regulatory driver and high resale or counterfeit stakes, such as EV batteries, whose origin and state of health already need documenting. Start with a minimal record (manufacturer, certifications, and current holder) that satisfies the ESPR fields for that category, then extend to repair and recycling events as the set of authorized signers grows.

## Why Ethereum

If one company or industry body runs the product passport registry, it can shape what claims appear, revoke records, and gate which brands or recyclers may read and write. Keeping the product record on neutral rails means no single operator owns the history, so manufacturers, regulators, recyclers, and secondhand buyers can all verify origin and certification claims for themselves.
