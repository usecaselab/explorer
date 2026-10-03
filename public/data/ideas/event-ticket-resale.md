---
title: "Event tickets with resale rights"
domains: media
desires:
  - fan/keep-what-i-pay-from-scalpers
---

## Problem

Concert and festival tickets sell out in seconds to bots and reappear on resale platforms at several times face value. The venue and the artist set the original price but capture none of the markup, which flows to scalpers and to the resale platform taking a cut on both the buy and the sell. Fans either pay the inflated price or risk a counterfeit, because a barcode emailed as a PDF can be screenshotted and sold twice. The primary platform usually runs its own resale marketplace too, so it has little reason to shut down the secondary markups it also collects fees on.

## Solution

Issue each ticket as an onchain asset whose contract carries the resale rules the venue and artist set: a price ceiling, an allowed resale window, and a royalty split that routes part of any resale back to them. A buyer can verify a ticket is genuine and not already resold by checking it against the contract rather than trusting whichever platform displayed it, and transfers settle between people directly without a gatekeeper marking up both sides.

A workable starting point is a single venue or touring act issuing general-admission tickets with a hard resale cap and a fixed artist royalty, validated at the door by scanning the onchain token. Assigned seating, transfer-on-entry rules, and integration with existing scanner hardware can follow once the resale economics are proven on one run of shows.

## Why Ethereum

A centralized ticket platform sits between fans and artists, sets the fees, runs an opaque resale market, and keeps the secondary value while venues lose control over their own pricing. Issuing tickets onchain keeps the resale rules and royalty splits with the venues and artists who set them, and lets fans verify a ticket is genuine without trusting whichever company happens to run the platform.
