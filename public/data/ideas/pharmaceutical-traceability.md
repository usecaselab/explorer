---
title: "Drug authentication and supply chain traceability"
domains: health, logistics-and-trade
desires:
  - manufacturer/prove-my-product-is-genuine
  - patient/verify-what-im-buying
  - shopper/verify-what-im-buying
---

## Problem

A patient buying antimalarials has no way to verify the drug isn't one of the estimated 1-in-10 medicines in low-income markets that are substandard or falsified. Counterfeit drugs with no active ingredient, or with toxic substitutes, kill hundreds of thousands of people a year. The root cause is that pharmaceutical supply chains lack end-to-end verification from manufacturer to point of dispensing, so no pharmacist or buyer can confirm an unbroken chain of custody at the moment of sale.

## Solution

Each unit carries a unique identifier that links to an onchain record of its journey from manufacturer through every distributor to the shelf. A pharmacist or patient scans the code at the point of dispensing and sees an unbroken chain of custody back to the factory, while a duplicate or out-of-sequence scan flags a unit that has been cloned or diverted. Regulators get end-to-end visibility into where in the chain falsified product is entering.

A workable starting point is one high-counterfeit category in one market, such as antimalarials or insulin, with manufacturers committing serial numbers at packaging and pharmacies scanning at dispense. Coverage can widen to more drug classes and deeper into distribution once the scan-to-verify loop is in routine use at the counter.

## Why Ethereum

A traceability system owned by one manufacturer or distributor can be edited to hide where counterfeits entered, and a pharmacist or patient has no way to check a record the same company controls. Recording each custody transfer onchain keeps the chain back to the manufacturer verifiable by anyone with a scan, so fraudulent insertion cannot be quietly written out.
