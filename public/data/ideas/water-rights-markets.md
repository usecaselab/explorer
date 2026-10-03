---
title: "Water rights trading and usage verification"
domains: utilities, environment
desires:
  - farmer/share-a-finite-resource-honestly
---

## Problem

In drought-prone farming regions, water rights are bought and sold in informal bilateral deals with no published prices, so a grower who needs to trade has no idea what an allocation is actually worth. Usage is policed by occasional physical inspections that a regulator cannot run often enough to catch illegal diversions, so a farmer who pumps past their allocation rarely gets caught. The result is a commons that rewards overuse: the neighbor with the deeper well or the quiet pump draws down the shared aquifer, and the people downstream only learn how much was taken once their own wells run dry. By then the depletion is years deep and hard to reverse.

## Solution

A registry where each water right exists as an onchain allocation that can be transferred directly between holders, paired with metered usage that flows in continuously from sensors on wells and diversion points. Every rights holder reads the same record of who is entitled to what and who has actually drawn how much, so a farmer can sell or lease an allocation without a paper title process, and an overdraw shows up as a discrepancy in the open rather than as a line in one agency's internal file. Pricing becomes visible because trades clear in one place instead of in private.

A workable starting point is one stressed basin with an engaged irrigation district: register existing allocations, fit meters at the largest diversion points first, and run trading among holders who already share the aquifer. Smaller meters and cross-basin transfers can come later.

## Why Ethereum

If one agency or company runs the allocation registry, large water users can pressure it to overlook diversions or keep trades quiet, leaving downstream users with no independent view. Recording allocations and metered usage onchain lets every rights holder see the same picture, so overuse is visible to the people it harms.
