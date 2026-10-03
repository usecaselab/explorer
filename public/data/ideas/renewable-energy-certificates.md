---
title: "Renewable energy certificate registries"
domains: environment, finance
desires:
  - investor/verify-what-im-buying
---

## Problem

A corporation claiming "100% renewable electricity" backs the claim with renewable energy certificates, one issued per megawatt-hour of clean generation. The unit is objective and metered, a megawatt-hour either generated or not, so unlike a carbon offset its value never turns on contested questions of additionality or permanence; the only real failure mode is counting the same megawatt-hour in more than one place. These certificates are tracked in regional registries that do not talk to each other: WREGIS, M-RETS, and PJM-GATS in the US, and separate national guarantee-of-origin registries across Europe, each operated by a body tied to the grid operators and utilities it serves. Because the systems are siloed and reconciliation is manual, the same generation can be claimed in more than one place, and a buyer or auditor checking a green-power claim has to trust each registry's word that a certificate was issued once and retired once. Generators, corporate buyers, and the regulators now policing greenwashing all work from records they cannot independently verify.

## Solution

Issue each certificate as an onchain asset minted against a metered generation reading, carrying the generator, the timestamp, the fuel type, and the location. Retirement burns the certificate in the open, so a megawatt-hour can be claimed exactly once and anyone can audit a corporate clean-energy claim against the certificates actually retired for it. Because issuance and retirement live on one neutral ledger instead of a dozen disconnected registries, cross-border and cross-registry double-counting becomes visible rather than a matter of trusting each operator.

The smallest viable version mirrors an established registry's issuances onchain in one market with a settled metering standard, letting buyers retire and prove certificates there before generators issue natively. Time-matched hourly certificates and links to carbon accounting can follow.

## Why Ethereum

The registries that mint and retire certificates today are run by entities tied to the utilities and grid operators whose output they certify, and each one is a closed silo whose records the rest of the market cannot inspect, which is exactly what makes double-claiming hard to catch. Putting issuance and retirement on a neutral onchain ledger means no single registry decides what counts as issued or already claimed, and a buyer, auditor, or competing generator can verify uniqueness for themselves. A certificate held in self-custody also cannot be quietly voided or reassigned by the operator. A centralized green registry asks every participant to trust the one party with a commercial stake in the result.
