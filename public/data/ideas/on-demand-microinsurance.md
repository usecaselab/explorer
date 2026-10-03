---
title: "On-demand microinsurance for informal workers"
domains: insurance
desires:
  - gig-worker/coverage-for-a-single-shift
---

## Problem

Delivery riders, rideshare drivers, day laborers, and market traders all carry real but intermittent risk: a crash on a shift, a damaged rental vehicle, an injury that stops a day's earning. The insurance market, though, is built for salaried workers on annual policies. Someone who only needs cover for the hours they are actually working cannot buy it by the shift, and the administrative cost of writing and adjusting a tiny short-duration policy outweighs the premium, so carriers simply do not offer it. The people most exposed to these risks end up the ones the market serves worst.

## Solution

Coverage that a worker switches on for a single shift, trip, or task, priced from their own work record. A rider activates cover when they accept a delivery, the premium is a few cents drawn automatically, and a clear loss such as a cancelled job or a logged accident pays out in the same flow that pays them for the work. Because the policy is a small self-executing contract rather than a hand-adjusted claim, the cost of serving a one-hour policy stays low enough to make it worth offering.

A workable starting point is a cooperative or union standing up trip cover for its members, turned on per delivery, with a fixed premium, a capped payout, and a trigger drawn from signals neither side solely controls, such as a logged accident report or device telematics rather than only the platform's records. Portable cross-platform pricing comes later.

## Why Ethereum

The Ethereum-shaped part of this is not the per-shift escrow, which a platform could run in its own database, but who funds the pool and who owns the work history that prices it. An onchain contract lets a cooperative or a union, rather than only a commercial carrier, stand up cover for its own members and hold the reserve under their collective control. It lets the worker carry the earnings and incident history that prices the cover between platforms, so insurability is theirs rather than rebuilt inside each app. And keying the trigger to signals neither side solely controls, instead of the hiring platform's own database, gives a worker with a cents-sized premium something to point to when a claim is denied, rather than the conflicted platform's word.
