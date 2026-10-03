---
title: "Peer-to-peer energy markets"
domains: utilities
desires:
  - community-organizer/coordinate-with-neighbors
  - shopper/send-receive-money-cheaply
---

## Problem

A homeowner with rooftop solar who generates more than they use has almost no way to sell that surplus to the neighbor next door who would happily buy it. The only buyer on offer is the utility, which pays a wholesale export rate it sets itself and then resells the same electrons to that neighbor at full retail. In many places net-metering credits are being cut or phased out, so the gap between what a producer is paid and what a nearby consumer pays keeps widening. The producer, the consumer, and the local feeder they share all sit behind a single monopoly that has no reason to let them deal with each other.

## Solution

A local market where neighbors on the same distribution network buy and sell electricity directly, with each trade metered and settled onchain. Producers post surplus, consumers buy it at a price the two sides agree on, and the contract clears payment automatically against meter readings, so a kilowatt-hour that stays on the local feeder is paid for locally rather than round-tripped through the utility's spread. Settlement that does not depend on the utility's billing system means a community can keep more value on its own circuit and reward the people who put panels and batteries on the roof.

A workable starting point is a single microgrid or one feeder where a community already controls its meters: a housing cooperative, a campus, or a village mini-grid. Trades settle in stablecoin against existing smart-meter data, the utility stays the backstop supplier, and full distribution-level rollout waits until the local clearing logic is proven.

## Why Ethereum

A monopoly utility sets the rate at which it buys back surplus solar and is the only party that can match neighbors who want to trade, so it has every reason to keep prices low and the market closed. Running local energy trading onchain lets neighbors transact directly on terms they agree to, with settlement that does not depend on the utility choosing to allow it.
