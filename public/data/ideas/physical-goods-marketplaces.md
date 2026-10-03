---
title: "Physical goods marketplaces"
domains: commerce
desires:
  - merchant/own-my-audience
  - shopper/peer-to-peer-commerce
---

## Problem

Someone selling a used camera, a bike, or a pair of sneakers to a stranger faces a standoff: the buyer will not pay before the item ships and the seller will not ship before they are paid, and neither can confirm the other is honest or that the goods are authentic rather than counterfeit. The usual fix is a marketplace that holds the money and adjudicates disputes, but it charges a double-digit fee for that single service, owns the dispute outcome, and can freeze a payout or favor whichever side it prefers. High-value resale categories like sneakers and watches have spawned dedicated authentication middlemen precisely because the base platforms cannot be trusted to settle fairly.

## Solution

Listings represented as onchain records and payment held in escrow that releases on confirmed delivery, so a buyer and seller who do not trust each other can transact without trusting a platform either. The escrow rule is visible to both before they commit, release is bound to a delivery confirmation or a signed handoff rather than a moderator's discretion, and where authenticity matters a verifiable provenance record or a third-party attestation can travel with the item.

The smallest viable version is peer-to-peer escrow for a single high-value resale category where fraud and platform fees both bite hardest, sneakers, watches, or used electronics, with funds released on a delivery scan and disputes routed to neutral arbitration. Reputation, authentication partners, and broader catalogs can build out from there.

## Why Ethereum

A marketplace platform holds the funds, decides every dispute, and can favor whichever side it prefers or take fees for the privilege of being trusted. Holding payment in escrow onchain lets buyer and seller transact without trusting each other or a company, with release bound to confirmed delivery rather than a platform's judgment.
