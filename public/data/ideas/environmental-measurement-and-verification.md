---
title: "Continuous environmental measurement and verification"
domains: environment
desires:
  - civic-participant/enforce-the-rules-already-on-the-books
  - investor/verify-what-im-buying
---

## Problem

Environmental claims such as renewable energy certificates, carbon intensity labels, ESG reports, and biodiversity credits rest on data the seller reports itself, checked by an audit that happens once a year if at all. That gap lets the same megawatt-hour or ton be counted twice, and lets a project keep selling credits long after the outcome it promised has reversed. Biodiversity credits are especially exposed: a credit for habitat that degraded a year after issuance looks identical on the registry to one backing a thriving ecosystem, and a buyer assembling a portfolio against a sustainability mandate has no way to tell them apart or to learn when one goes bad.

## Solution

Tie each environmental credit to a live measurement stream rather than a one-time audit. Sensors, satellite imagery, acoustic monitoring, and remote sensing feed readings committed onchain on a schedule, so a credit carries a running, timestamped proof that the outcome it represents still holds. When a monitored value crosses a threshold, say canopy loss on a forest plot, the credit's record flags or invalidates automatically, and a buyer sees the degradation instead of discovering it years later.

A workable starting point is one outcome with a cheap, hard-to-game signal, such as satellite-measured forest cover on a defined parcel, attached to the credits issued against that parcel. Acoustic biodiversity monitoring and ground-sensor networks can layer on once the satellite feed is trusted.

## Why Ethereum

Environmental claims today rest on data the issuer self-reports, and an auditor it pays can be dropped or pressured by the party it is supposed to check. Logging sensor and satellite data continuously onchain gives buyers and the public a measurement they can verify independently, and keeps a credit's record from being revised once an outcome reverses.
