---
title: "Metering and paying home energy devices for grid flexibility"
domains: utilities
desires:
  - shopper/send-receive-money-cheaply
---

## Problem

Home energy devices like batteries, smart thermostats, EV chargers, and water heaters can shift or reduce their load to help balance the grid, and utilities increasingly need that flexibility. There is no scalable way to meter what each individual device contributed and pay its owner for it. Every device runs a different protocol, and the contribution of any single home is too small for grid operators to track and settle on its own, so the flexibility goes uncompensated and underused.

## Solution

A settlement layer that meters the load reduction each device delivers, verifies it against the home's smart meter baseline, and pays the device owner automatically. By pooling many small contributions into one verifiable record, it makes it practical for aggregators to enroll millions of household devices and compensate each one for the flexibility it provides.

## Why Ethereum

An aggregator that meters device contributions and also pays for them reports on its own performance, and device owners have no independent way to confirm the demand reductions credited to them were measured honestly. Building the settlement layer onchain keeps the metering rules and the payment record verifiable by owners and regulators, so compensation does not rest on trusting the aggregator's books.
