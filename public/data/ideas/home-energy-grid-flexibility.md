---
title: "Metering and paying home energy devices for grid flexibility"
domains: utilities
desires:
  - shopper/send-receive-money-cheaply
---

## Problem

Home energy devices like batteries, smart thermostats, EV chargers, and water heaters can shift or reduce their load to help balance the grid, and utilities increasingly need that flexibility. There is no scalable way to meter what each individual device contributed and pay its owner for it. Every device runs a different protocol, and the contribution of any single home is too small for grid operators to track and settle on its own, so the flexibility goes uncompensated and underused.

## Solution

A settlement layer that meters the load each device shifts or sheds during a grid event, checks it against the home's smart meter baseline, and pays the owner automatically against that verified record. Because the metering rule and the payment are the same onchain logic, an aggregator can pool millions of tiny household contributions into one auditable record and still compensate each device for exactly what it delivered, rather than averaging everyone into a flat credit that hides who actually showed up.

The smallest viable version is one device class in one utility's flexibility program: home batteries responding to a published dispatch signal, with each event's baseline, measured reduction, and per-kWh price written onchain and the owner paid in stablecoin at settlement. Thermostats, EV chargers, and water heaters can join once the metering format is proven on the simplest, most measurable load.

## Why Ethereum

An aggregator that meters device contributions and also pays for them reports on its own performance, and device owners have no independent way to confirm the demand reductions credited to them were measured honestly. Building the settlement layer onchain keeps the metering rules and the payment record verifiable by owners and regulators, so compensation does not rest on trusting the aggregator's books.
