---
title: "Title & escrow"
domains: real-estate-and-housing
desires:
  - homeowner/faster-closings
---

## Problem

A residential closing takes 30 to 60 days, much of it spent on a title company manually retracing the chain of deeds in a county registry to confirm the seller actually owns what they are selling and that no liens are attached. The buyer pays for that search and for title insurance against the chance it missed something, often several thousand dollars, on top of escrow fees for an agent who holds the funds until conditions are met. The chain already exists in the public record, so the work is largely re-verifying paper that someone could have signed off on once. A single missing signature or a clouded lien can push the date out twice, and the buyer carries the cost and the uncertainty either way.

## Solution

Keep the property's ownership chain and liens as an onchain record so each transfer is confirmed against history that does not have to be re-searched from scratch, and run the escrow as a contract that releases funds and records the deed transfer the moment closing conditions are signed off. The seller's ownership and any encumbrances are verifiable by anyone, and settlement happens in one step instead of a courier loop.

The smallest viable version is escrow alone: funds held in a contract that releases to the seller and transfers the deed record when both sides sign the closing conditions, while the legal title search stays as it is today. That removes the escrow agent as a discretionary middleman and shortens settlement, before tackling the harder job of moving the full title chain onchain.

## Why Ethereum

Title companies and escrow agents sit between buyer and seller, hold the funds, and are the sole authority on whether ownership records are correct, which adds cost and a point of failure both parties must trust. Recording title and escrow onchain keeps the ownership chain auditable by anyone and releases funds against conditions neither side can quietly rewrite.
