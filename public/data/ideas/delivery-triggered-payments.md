---
title: "Delivery-triggered payments"
domains: logistics-and-trade
desires:
  - gig-worker/get-paid-faster
---

## Problem

Suppliers and freight carriers routinely wait weeks to be paid after goods are delivered. Payment depends on reconciling shipping documents, invoices, and proof of delivery by hand, and the carrier rarely holds verifiable proof of where the goods are or what condition they arrived in, so there is nothing to trigger settlement automatically. The party that owes the money also runs the system that decides when delivery counts as proven, so a carrier with bills to pay floats the cost while paperwork moves through an accounts-payable queue. Small carriers feel it worst, since they lack the balance sheet to absorb a sixty-day gap.

## Solution

Funds held in escrow that release against delivery events an oracle can verify: proof of location when a shipment reaches its destination, proof of condition from sensors on temperature or shock, and a signed receipt at handoff. When the agreed conditions are met the payment settles in the same flow, so a carrier is paid on proof rather than on the payer's accounts-payable cycle.

The smallest viable version is a single high-value lane where condition matters, such as cold-chain pharma or perishables, with one sensor feed and a fixed payment that releases on a clean delivery and flags an exception otherwise. Multi-leg shipments, partial releases, and disputed-delivery handling can layer on later.

## Why Ethereum

When a buyer or a platform controls the system that decides when delivery counts as proven, the party that owes money also controls the trigger for paying it, and carriers wait while reconciliation drags. Building settlement onchain keeps the release conditions and the delivery record verifiable by both sides, so payment follows agreed proof rather than the payer's discretion.
