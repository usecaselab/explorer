---
title: "Affordable housing covenant enforcement"
domains: real-estate-and-housing, government
desires:
  - civic-participant/enforce-the-rules-already-on-the-books
  - community-organizer/enforce-the-rules-already-on-the-books
---

## Problem

Affordable housing deed restrictions hold a unit below market rate for a fixed term, often 30, 50, or 99 years, in exchange for public subsidy or a density bonus the developer already received. These covenants live in paper legal documents that someone has to read and apply by hand at every resale or re-rental. In practice the check depends on whichever title officer or housing agency happens to look, and busy conveyancing routinely lets a restricted unit transfer at full market price. Once that happens the affordability is gone, the public got nothing for the subsidy it paid, and the next low-income household that should have qualified never hears the unit existed.

## Solution

Encode the affordability restriction into the onchain record that governs the unit's transfer, so the covenant is checked the moment a sale or lease is registered rather than depending on someone remembering to look. The rule travels with the property, names the ceiling price and the qualifying conditions, and a transfer that breaches it is flagged or blocked at registration instead of discovered years later.

The smallest viable version is one housing agency attaching a covenant attestation to the units in a single subsidy program, with a public check that any title officer, lender, or tenant can run against a proposed transfer. That alone turns a covenant nobody verifies into one that surfaces a violation at the point of sale. Automated price enforcement and integration with the deed registry can follow once the attestation is trusted.

## Why Ethereum

When a covenant lives only in paper records, enforcement depends on whichever office happens to review a transfer, and an owner with an incentive to convert the unit can count on the check being missed. Encoding the restriction into the asset onchain means the rule travels with the property and stays verifiable by tenants and the public rather than sitting with a registry that has to notice a violation.
