---
title: "Cap tables"
domains: business-operations
desires:
  - founder/one-source-of-truth-for-equity
---

## Problem

A startup's ownership record is the most consequential document it holds, yet it usually lives inside a vendor platform like Carta that charges by the seat and keeps the data behind its own access controls. Every financing round, option grant, and secondary transfer is entered by hand, and the platform's copy drifts from the side letters, board consents, and SAFEs that actually govern who owns what. When a founder has to confirm a stakeholder's position for a new investor or an acquirer's diligence, the answer depends on whichever record happens to be current, and squaring them is slow legal work. Employees holding options often cannot see their own stake without the company granting them access through the vendor.

## Solution

A startup's cap table kept as an onchain record from incorporation onward, with each issuance, vesting event, and transfer written to it as it happens and signed by the parties to it. Founders, investors, and employees read the same authoritative record directly instead of asking a vendor for a view of it, and a share transfer updates ownership in place rather than generating a reconciliation task to square the official version later. The terms of each instrument travel with the entry, so anyone with a stake can verify their position without trusting a platform's export.

A workable starting point is a single early-stage company issuing its founder shares and option pool onchain, with its existing law firm signing each entry the way it signs a stock ledger today. Late-stage secondary trading, automated vesting, and investor portals can layer on once the base ledger is trusted.

## Why Ethereum

When a cap table lives on a vendor's platform, founders and investors depend on that company to keep the record accurate, grant access, and not change its terms or pricing, and the official version can quietly diverge from what shareholders believe they hold. Recording ownership onchain gives every party the same signed record, verifiable directly and not held hostage to one provider.
