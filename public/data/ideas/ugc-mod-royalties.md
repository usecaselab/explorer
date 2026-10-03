---
title: "Creator royalties for game mods and user content"
domains: media
desires:
  - fan/paid-for-value-i-drive
---

## Problem

Modders and content creators build the maps, skins, and tools that keep players engaged long after a game ships, and they are rarely paid for it. Platforms host the content and collect the engagement it drives, but offer no enforceable way to share revenue tied to actual usage, so a mod downloaded millions of times earns its author nothing beyond a donation link. When a publisher does run a creator program, it sets the payout rules on its own and can change or end them whenever it likes. The people whose work extends a game's life have no claim on the value they generate.

## Solution

Represent mods, maps, and other user content as onchain assets carrying a royalty contract, so that when the content is sold, equipped, or used, a share of the associated revenue routes to its creator automatically against the usage data the platform already records. The split is enforced by the contract rather than by a publisher choosing to honor it, and creators can build on each other's work with downstream royalties flowing back up the chain of contributors.

A workable starting point is paid cosmetic mods in a single game, where each item is registered onchain with a fixed creator share that settles on every sale through the in-game store. Usage-metered royalties on free content and multi-creator splits for derivative works can follow once the paid case proves the routing works.

## Why Ethereum

When a game platform decides whether and how modders get paid, the company that profits from their work also sets the payout rules and can change or withhold them at will. Putting the royalty logic onchain ties creator splits to actual usage in a way no single platform controls, so compensation does not depend on a publisher choosing to honor it.
