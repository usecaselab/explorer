---
title: "Creator likeness and voice licensing"
domains: media
desires:
  - creator/license-my-likeness
---

## Problem

Synthetic voice and video tools can now reproduce a specific performer's voice or face convincingly, and studios, advertisers, and game makers want to use them. A voice actor or musician who agrees to license their likeness has no reliable way to set the terms of that use, no way to prove they consented to a given project, and no way to make sure they are paid each time their synthetic voice or face is deployed. The deal today is a one-off contract held by the studio, which controls how the likeness gets used afterward and owns the only record of what was permitted. When a synthetic performance turns up somewhere the performer never approved, the burden falls on them to litigate and prove they never agreed to it.

## Solution

Let a performer issue a licensing contract for their voice or likeness that states exactly what uses are permitted, at what rate, and for how long, with their consent recorded onchain and payment routed to them automatically each time a licensed use is registered. A studio or tool that wants to generate a synthetic performance checks the contract for permission and pays per the terms, and the performer holds a verifiable record of what they did and did not authorize.

A workable starting point is a single voice actor licensing one named use, for example a specific game studio generating in-game lines, with a fixed per-use fee and an explicit expiry, settled onchain. Broad catalog licensing, revocation handling, and detection of unlicensed use can come once the consent-and-pay loop works for one performer and one buyer.

## Why Ethereum

A countersigned, timestamped contract can already settle whether a performer consented to a deal, so the consent record on its own is not what needs a chain. What a single counterparty cannot give the performer is a metered payment path they control: when the license lives in a studio's files, payment also runs through that studio's accounting, and the performer has to take on faith that every licensed generation was counted and paid. Issuing the license as a contract the performer holds themselves turns it into a self-custodial pay-per-use rail, where the terms and rate sit with the performer and payment fires directly to them on each licensed generation rather than being routed through a studio's or platform's books and reconciled after the fact. Detecting unlicensed synthetic use in the wild is a separate problem that lives off-chain, and this rail does not solve it.
