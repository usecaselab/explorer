---
title: "Customs records across borders"
domains: logistics-and-trade
---

## Problem

Cross-border shipments are delayed at customs because each agency keeps clearance documents and compliance status in its own proprietary database, with no real-time view that the agencies on either side of a border can both read.

## Solution

Customs documents and compliance status anchored onchain as commitments, with the documents themselves held off-chain and checked against onchain merkle proofs. An agency on either side of a border verifies a shipment's clearance and tariff status against the same attestations instead of re-requesting paperwork, so clearance is not held up waiting for one party to confirm what another has already verified.

## Why Ethereum

A centralized customs system run by one vendor or one government puts a single operator in control of clearance for everyone, able to set access terms, see every shipment, or cut off a jurisdiction it disagrees with. Building it on neutral rails means no participating agency controls the system, and each can verify compliance status directly rather than trusting another party's database.
