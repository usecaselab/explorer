---
title: "Returnable transport asset pools"
domains: logistics-and-trade, commerce
desires:
  - manufacturer/procurement-that-reconciles-itself
---

## Problem

Pallets, crates, kegs, gas cylinders, and reusable shipping containers circulate constantly between manufacturers, distributors, and retailers, and someone has to track who is holding how many and who owes a deposit on them. Most of this runs through pooling operators that own the registry, charge per movement, and bill members for assets the operator's own count says have gone missing. Because each company also keeps its own tally in a separate system, the two rarely agree, and reconciling them is a recurring monthly chase that ends in a dispute settled on whoever's numbers carry more weight. A retailer can be charged for hundreds of 'lost' pallets it believes it returned, with no neutral record to point to. The cost of the mismatch, and the float tied up in deposits, falls on the smaller party in the relationship.

## Solution

Track each returnable asset, or batch of them, as an entry on a shared onchain registry, with custody transferring when both the sender and the receiver sign a handoff. The deposit rides with the asset: it moves from one party's balance to the other's at the moment custody changes and returns automatically when the asset comes back, so there is one record both sides reconcile against instead of two tallies that drift apart. Losses, and the fees charged against them, are computed from handoffs nobody can edit after the fact rather than from an operator's private count.

A workable starting point is a single high-value reusable asset within one closed loop, such as kegs between a brewery and its venues or gas cylinders between a supplier and its customers, where each handoff is scanned and counter-signed and the deposit settles in a stablecoin. Open pooling across many operators can follow.

## Why Ethereum

In a conventional pool the operator owns the registry, sets the fees, and runs the count that decides who lost what, so a member disputing a charge is arguing against the same party that keeps the books and profits from the assets booked as missing. Holding custody and deposits on an onchain registry that both sides sign into takes the count out of any one operator's hands and lets each member verify the asset and deposit balances itself. It also lets competing logistics firms and their customers share one pool without appointing a single company to hold the record and the float, which is the arrangement that makes today's pools a chokepoint.
