---
title: "Residential leasing"
domains: real-estate-and-housing
desires:
  - renter/rental-deposit-escrow
---

## Problem

A residential lease runs on the landlord's paperwork and the landlord's bank account. The tenant pays rent into an account they cannot see, hands over a deposit of one or two months' rent that disappears into the same place, and trusts the landlord to return it on the landlord's own timeline after move-out. When a deposit is withheld for damage the tenant disputes, or rent is recorded as late when it was paid on time, the only recourse is small-claims court, which often costs more in time and filing fees than the deposit is worth. The discretion sits entirely with the party holding the money, and most tenants simply absorb the loss.

## Solution

Run the lease as a contract both sides agree to and can inspect: rent due dates and amounts, the deposit held in onchain escrow rather than the landlord's account, and the conditions for returning it. Rent payments settle to a record neither party can quietly rewrite, and the deposit releases against a signed move-out inspection rather than the landlord's mood, with a genuine dispute routed to neutral arbitration instead of court.

The smallest viable version is deposit escrow alone: the deposit sits in a contract that returns it automatically on a countersigned move-out inspection, or routes the contested portion to arbitration. That removes the single sharpest point of landlord discretion without rebuilding rent collection. Programmable rent and automated renewals can come later, once tenants and landlords trust the escrow flow.

## Why Ethereum

In a normal lease the landlord holds the deposit and controls the paperwork, so a tenant depends on that landlord's goodwill to get terms honored and money returned. Running rent, deposits, and renewals onchain fixes the terms in a smart contract both parties agreed to and can inspect, so neither side can quietly change them and disputes resolve against a record no one owns alone.
