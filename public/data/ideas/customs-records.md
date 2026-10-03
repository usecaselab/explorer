---
title: "Customs records across borders"
domains: logistics-and-trade
desires:
  - manufacturer/cross-border-trade
  - merchant/send-receive-money-cheaply
---

## Problem

Cross-border shipments routinely sit at customs while agencies on each side of a border wait on paperwork. Each agency keeps clearance documents and compliance status in its own proprietary database, with no shared real-time view, so the importing authority re-requests certificates the exporting authority has already validated. A container can be held for days because one office cannot confirm what another office has already confirmed. The cost falls on the trader, who pays demurrage and storage while documents are re-keyed and re-checked.

## Solution

Customs documents and compliance status anchored onchain as commitments, with the documents themselves held off-chain and checked against onchain merkle proofs. An agency on either side of a border verifies a shipment's clearance, origin, and tariff status against the same attestations instead of re-requesting paperwork, so clearance is not held up waiting for one party to confirm what another has already verified.

A workable starting point is one trade lane between two cooperating customs authorities and a single document type, such as the certificate of origin, where the exporting authority signs an attestation the importing authority checks before release. Once that handoff proves out, additional document types and lanes attach to the same record without renegotiating the format each time.

## Why Ethereum

A centralized customs system run by one vendor or one government puts a single operator in control of clearance for everyone, able to set access terms, see every shipment, or cut off a jurisdiction it disagrees with. Building it on neutral rails means no participating agency controls the system, and each can verify compliance status directly rather than trusting another party's database.
