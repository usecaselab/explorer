---
title: "Portable ratings & reviews"
domains: commerce
desires:
  - gig-worker/portable-reputation
  - shopper/peer-to-peer-commerce
---

## Problem

A review you write on one platform stays there. Your accumulated reputation as a reliable reviewer, the products you have actually purchased, and the ratings you have given are siloed by Amazon, Yelp, Google, and each marketplace, and cannot travel with you to a new app or be carried into a context where the host platform has not approved it. A buyer searching for trustworthy review history on a new platform faces a cold start: the reputational signal is thin or missing entirely.

## Solution

Ratings and reviews kept as portable attestations the reviewer signs and controls, with the underlying purchase or interaction proven by an onchain receipt or credential. A reviewer's history travels with them across marketplaces and apps, a buyer can check whether a reviewer actually bought what they reviewed, and a new platform can bootstrap on existing reputation rather than starting from zero.

## Why Ethereum

When reviews live inside each marketplace, the platform owns the reputational signal and the writer cannot move it elsewhere. Recording reviews and the receipts behind them onchain keeps both with the reviewer, so the same reputation can be presented on any app and a receipt cannot be silently dropped by a platform that finds it inconvenient.
