---
title: "Letters of credit"
domains: logistics-and-trade
desires:
  - manufacturer/cross-border-trade
  - merchant/send-receive-money-cheaply
---

## Problem

A letter of credit is the bank guarantee that an importer will pay an exporter once delivery conditions are met, and it underpins a large share of cross-border trade. In practice it still runs on paper: documents are couriered between the importer's bank, the exporter's bank, and correspondent banks across countries, a process that takes five to ten days and costs 500 to 1,500 dollars per transaction. For what is fundamentally a conditional message saying 'we will pay if these documents check out,' the cost and delay are out of proportion to the work involved. The exporter ships before being paid and carries the financing gap while paperwork moves, and smaller traders, who feel the fees and the wait most, are often priced out of using letters of credit at all.

## Solution

Issue letters of credit as smart contracts that the importer's and exporter's banks both write to, so the guarantee, its conditions, and its current status live in one record instead of a stack of couriered originals. When the agreed documents are presented and verified (the bill of lading, the inspection certificate, proof of delivery), payment releases to the exporter automatically, with no physical exchange and no correspondent bank to wait on.

A workable starting point is a single trade lane between two banks already willing to recognize a digital instrument, settling in a stablecoin against a short, well-defined document set such as a bill of lading and an inspection certificate. The banks keep underwriting the importer's credit exactly as they do now; only the document handling and settlement move onchain.

## Why Ethereum

A digital letter-of-credit network owned by one bank or consortium would let those operators decide who can issue and clear, and route every trade through infrastructure they control and price. Running letters of credit onchain keeps the guarantee and its conditions outside any single institution's hands, so any bank can participate and counterparties can verify the terms themselves rather than trusting a courier and an intermediary.
