---
title: "Spot freight market for trucking"
domains: logistics-and-trade, commerce
desires:
  - gig-worker/portable-reputation
---

## Problem

Freight brokers sit between shippers who need loads moved and carriers who have trucks available, and they take 15 to 20 percent of the freight bill on every load in exchange for making the match. Much of that spread exists because the broker holds the relationships and the information: a carrier cannot see what a shipper is paying, and a shipper cannot see what a carrier would accept. For a straightforward lane that needs no special handling, that margin buys coordination a transparent market could provide directly. The cost falls hardest on small owner-operators, who run on thin margins and have little leverage over the broker setting their rate.

## Solution

A spot freight marketplace where shippers post loads with specifications and payment terms, carriers bid directly, and the agreed rate sits in onchain escrow that releases automatically on verified delivery. Both sides build a reputation from their actual transaction history, so a carrier's on-time record and a shipper's prompt-payment record travel with them rather than living in a broker's private files. On routine loads that need no physical coordination, the broker layer comes out and the carrier keeps the margin that used to be the spread.

A workable starting point is a single dense lane or a regional shipper network where loads are standardized and delivery can be confirmed from a signed proof of delivery or a telematics ping, with disputes routed to onchain arbitration. Multi-leg and specialized freight can come later.

## Why Ethereum

A freight marketplace run by one company recreates the broker problem: the operator holds the relationships and the reputation data, sets the take rate, and can drop a shipper or carrier from the market it controls. Running the marketplace onchain keeps the escrow and the reputation history outside any one operator's hands, so carriers carry their record between platforms and neither side depends on a middleman to hold funds honestly.
