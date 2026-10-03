---
title: "Fractional property ownership"
domains: real-estate-and-housing, finance
desires:
  - investor/access-gated-markets
---

## Problem

Owning a slice of income-producing real estate is something institutions do routinely and retail investors mostly cannot. A single rental property runs into the hundreds of thousands of dollars, so the small investor either buys a public REIT that bundles thousands of buildings they cannot see, or signs into a sponsor's private deal where the sponsor holds the title-owning LLC, decides when distributions go out, and controls the only door to selling the stake. The platforms that promised fractional access still custody the asset and run a thin in-house resale book, so an owner who wants out waits for the sponsor to find a buyer at a price the sponsor influences. The grievance is the same at every level: someone between the investor and the building controls the cash flow and the exit.

## Solution

Hold fractional ownership of a specific property as onchain shares the investor self-custodies. An operator still collects the rent off-chain and deposits it into the contract, but once it lands the contract splits it pro-rata by rule rather than when a sponsor chooses to release it, and every deposit is a public record holders can check. The shares resell on any compliant venue the holder picks rather than only the sponsor's in-house book, so the exit does not hinge on the original platform staying alive, even where the shares carry the transfer restrictions a regulated security requires.

The smallest viable version is one already-owned, income-producing building whose title sits in an entity whose membership interests are mirrored as onchain shares, with rent deposited and split onchain and a public holder record. That gives self-custody and a resale market the sponsor does not gate, without first solving permissionless title transfer.

## Why Ethereum

Today a sponsor or platform sits between the investor and the property, custodies the ownership vehicle, meters the distributions, and operates the only resale market, which lets it set the price of both entry and exit and quietly favor itself. Holding the shares onchain does not remove the off-chain operator that collects rent and funds the contract, and the shares of a regulated security still carry transfer restrictions, so this is not frictionless permissionless trading. What it does change is that the holder self-custodies the stake instead of leaving it in the sponsor's vehicle, the rent splits by rule once deposited rather than when the sponsor decides, and the resale market is whatever compliant venue holders choose rather than the sponsor's in-house book. A centralized platform structurally cannot offer that, because its business is being the gate.
