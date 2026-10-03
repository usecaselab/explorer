---
title: "Repair escrow for unaddressed habitability issues"
domains: real-estate-and-housing
desires:
  - renter/repairs-the-landlord-cant-ignore
---

## Problem

When the heat fails in winter or the plumbing backs up, a tenant's only real leverage is to withhold rent and risk an eviction filing, or to wait months for a housing-code complaint to be heard while living with the problem. Landlords who know the complaint process is slow can let habitability issues sit, since the tenant who withholds rent is the one formally in breach. The tenant is forced to choose between their home and their legal standing, and the most exposed, the elderly, the undocumented, anyone who cannot risk an eviction record, simply absorb the conditions. The leverage sits with the party that controls both the building and the rent account.

## Solution

Route rent through an escrow that pays the landlord on schedule while the unit is sound, but diverts the next payment into a dedicated repair fund when a documented habitability issue passes an agreed deadline without being fixed. The tenant logs the problem with timestamped evidence, the landlord has a set window to resolve it, and only if the deadline lapses does the contract redirect rent toward a licensed repair the tenant can then commission, all without the tenant unilaterally breaching the lease. A workable starting point is a single unambiguous trigger such as no heat or no running water past a statutory deadline, verified by a photo log plus a third-party inspector, in a jurisdiction whose repair-and-deduct law already exists on paper. Broader habitability categories and dispute handling can follow.

## Why Ethereum

Repair-and-deduct is already a statutory right in many jurisdictions: a tenant can pay for a fix and subtract it from rent. An onchain escrow does not grant that right or add legal force to it, and it does not shield a tenant from an eviction filing. What it changes is who holds the money while the clock runs. Today the landlord controls both the building and the rent account, so acting on the right means the tenant withholds first and exposes themselves. Routing rent through a neutral escrow automates the same statutory step instead: on a documented issue that passes its deadline, the contract diverts the next payment into a repair fund on a rule the landlord does not control. The trigger still turns on an off-chain inspector confirming the issue; the contract only enforces the deadline both sides agreed to.
