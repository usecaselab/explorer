---
title: "Collaborative royalty splits"
domains: media
desires:
  - creator/keep-what-i-sell
---

## Problem

When several people make a piece of music together, a songwriter, a producer, a featured vocalist, they agree on who owns what percentage in a "split sheet" that is often a handshake or a note that never gets formalized. Months or years later, when the track earns from streaming, sync, or a collecting society, those splits get disputed, misremembered, or quietly ignored by whoever controls the payout. Collecting societies and distributors pay one account holder, who is then trusted to pass on everyone else's share, and that trust regularly breaks down. Collaborators with no written agreement and no leverage end up chasing money they are owed or writing it off entirely.

## Solution

Register the split as an onchain agreement that every collaborator signs, then route the work's incoming revenue through it so each person's share pays out automatically the moment money arrives, in the percentages everyone agreed to upfront. There is no lead account holder deciding when and whether to forward the others their cut, and the split is a record any collaborator or downstream payer can verify rather than a document that lives in one person's inbox.

A workable starting point is a single distributor or sync platform paying a track's earnings into the split contract instead of to one account, with fixed percentages locked at release. Renegotiation rules, advances against a future share, and integration with collecting societies can follow once revenue is flowing through one agreed split.

## Why Ethereum

Today one collaborator, or the distributor that pays them, holds the money and the discretion to divide it, so everyone else depends on that party remembering, agreeing, and choosing to pay. Putting the split agreement and the payout routing onchain takes the discretion out of any single hand: revenue divides by the rules the collaborators signed, where each of them can verify their share and no lead account or platform can quietly withhold it. A database could record the agreed percentages, but it would still leave one party controlling the account the money actually lands in.
