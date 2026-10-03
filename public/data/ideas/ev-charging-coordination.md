---
title: "Cross-network EV charging roaming settlement"
domains: utilities
desires:
  - shopper/send-receive-money-cheaply
---

## Problem

When an EV driver charges on a network other than their home provider, the roaming transaction has to clear between the charge point operator (CPO) that owns the hardware and the eMobility service provider (eMSP) that holds the driver's account. Today that clearing runs on bilateral settlement agreements, and each CPO-eMSP pair needs its own custom integration. In Europe alone there are several hundred CPOs and dozens of eMSPs, so most of the possible roaming pairs simply do not exist. The driver who pulls up to a charger outside their provider's deals is told to download another app and create another account before they can draw a single kilowatt-hour.

## Solution

A neutral settlement layer where any CPO and any eMSP clear roaming sessions against a shared standard instead of a private agreement. Each session produces a signed record (kWh delivered, timestamp, location, tariff) that both the operator and the provider confirm onchain, and payment from the driver's provider to the host operator executes automatically when the session closes. With settlement open to anyone who adopts the format, a new operator is reachable by every provider the day it connects, rather than after months of pairwise deals.

A workable starting point is one corridor and a handful of operators who already lose drivers to missing roaming: agree the session-record format, settle in a stablecoin, and leave each operator's own pricing and hardware untouched. Cross-region pricing and reservation flows can follow once clearing works.

## Why Ethereum

If a single clearinghouse owned the roaming layer, it would decide which operators get to connect and could price its position as the chokepoint every charging session passes through. Settling sessions on neutral rails lets any operator and any provider clear with each other directly, and the rules of settlement are inspectable by all of them rather than set by one company.
