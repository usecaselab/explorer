---
title: "Cross-network EV charging roaming settlement"
domains: utilities
---

## Problem

When an EV driver charges on a network other than their home provider, the roaming transaction passes through bilateral settlement agreements between the charge point operator (CPO) and the eMobility service provider (eMSP) — each pair requiring a custom integration. In Europe alone there are 500+ CPOs and dozens of eMSPs, and the bilateral model means most roaming pairs simply don't exist, leaving drivers unable to charge on large portions of the network without creating new accounts.

## Solution

A neutral settlement layer where any CPO and any eMSP can clear roaming transactions without bilateral agreements — using standardized session records (kWh delivered, time, location, tariff) that both parties confirm onchain, with payment executing automatically at session close.

## Why Ethereum

If a single clearinghouse owned the roaming layer, it would decide which operators get to connect and could price its position as the chokepoint every charging session passes through. Settling sessions on neutral rails lets any operator and any provider clear with each other directly, and the rules of settlement are inspectable by all of them rather than set by one company.
