---
title: "Electronic Bill of Lading"
domains: logistics-and-trade
desires:
  - manufacturer/cross-border-trade
  - merchant/send-receive-money-cheaply
---

## Problem

The bill of lading is the single most important document in international shipping: it is the document of title, the receipt for the goods, and the contract of carriage at once, and whoever holds the original controls the cargo. Yet it still circulates as a paper original that must be physically couriered between shipper, carrier, banks, and consignee. A container can arrive at port days before its bill of lading does, stranding the goods, and the paper itself is forgeable, so fraud and delay are built into the process. Existing electronic versions run on closed registries that every party in the trade lane has to join and trust.

## Solution

Represent the bill of lading as an onchain asset that carries title and transfer rights, so possession moves with a signed transaction rather than a courier pouch. The carrier issues it at loading, it passes through the banks and the consignee as the cargo changes hands, and the holder of record can present it to claim the goods, with each transfer verifiable by anyone in the chain rather than by a single registry operator.

A workable starting point is one carrier issuing electronic bills on a single trade lane, with the importer's bank and the consignee as the only other parties, so the full title chain proves out end to end before more carriers and lanes join. The legal recognition this needs already exists under the model law on electronic transferable records that a growing set of jurisdictions have adopted.

## Why Ethereum

An electronic bill of lading run on one provider's platform makes that company the registry of who holds title, able to set access terms, see every trade, or freeze a transfer, and the whole trade lane depends on it staying available. Building it on neutral rails keeps the document of title as an asset the holder controls directly, transferable and verifiable without any single operator's permission.
