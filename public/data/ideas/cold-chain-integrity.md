---
title: "Cold chain integrity records"
domains: logistics-and-trade, health
desires:
  - manufacturer/quality-records-buyers-trust
  - patient/verify-what-im-buying
---

## Problem

Vaccines, biologics, insulin, fresh produce, and seafood have to stay within a narrow temperature range from the factory to the point of use, and a single excursion can ruin a shipment without leaving any visible sign. Today the temperature log is usually held by the carrier or third-party logistics provider moving the goods, which is the same party that would be penalized if the record showed an excursion. Data loggers are often read out only at the destination, and the file can be trimmed or a reading dropped before anyone downstream sees it. When a patient receives a vaccine that spent an afternoon too warm, or a buyer accepts produce that thawed in transit, the loss surfaces only as spoilage or, worse, as a treatment that quietly fails. A large share of vaccines are wasted every year, much of it to cold-chain breaks that no one can pin down after the fact.

## Solution

Stream readings from a tamper-evident sensor in each shipment to an onchain record as the goods move, so the condition history is committed continuously rather than handed over as an editable file at the end. The acceptance rule lives in the same contract: if the cargo stays in range the shipment clears and payment releases, and if a threshold is crossed the breach is recorded the moment it happens, so the consignee can reject or discount the lot on evidence rather than argument. Every party reads the same history, and no single carrier can revise it after delivery.

A workable starting point is one high-value perishable lane, such as a vaccine consignment or a fresh-seafood export, with a signed sensor device, a fixed temperature band, and a payout-or-rejection rule agreed up front. Multi-leg handoffs and finer thresholds can come later.

## Why Ethereum

The chain-shaped problem here is settlement between parties who do not trust each other. The carrier liable for an excursion is also the one holding the log, so a file it can trim at delivery is worthless to the buyer or insurer downstream. Committing readings continuously to an onchain record as the shipment moves means the condition history cannot be trimmed at the end, and the same contract can hold payment in escrow and release or reject it automatically the moment the agreed band is crossed, so adversaries settle against a record none of them owns rather than arguing over a file one of them controls. What the chain cannot do is vouch for the sensor. A device that is spoofed, bypassed, or parked in a cold box while the cargo sits out in the heat will sign a clean history that commits just as faithfully as an honest one. The sensor is the trust anchor the chain does not secure, and binding a trustworthy one to the physical cargo is the harder, off-chain half of the problem.
