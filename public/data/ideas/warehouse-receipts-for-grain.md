---
title: "Warehouse receipts for stored grain"
domains: food-and-agriculture, finance
desires:
  - farmer/access-to-credit
---

## Problem

At harvest, prices are at their seasonal low because every farmer in a region sells at once, yet most smallholders sell immediately anyway because they need cash and have nowhere safe to store grain. A farmer who could hold the crop a few months would often capture a much higher price, but storing it means trusting a warehouse that issues a paper receipt, or going without storage at all. Where warehouse-receipt systems do exist, they are plagued by fraud: an operator issues receipts against grain that is not there, or pledges the same stored lot to several lenders at once, and a few collapses poison lender trust for an entire region. So farmers sell into the harvest glut and the gains from storage flow to traders who own their own silos.

## Solution

A warehouse receipt issued onchain when a farmer deposits a graded lot, recording the quantity, the quality grade, and the store, and serving as a claim the farmer can hold, sell, or pledge as loan collateral. Because each receipt is a unique onchain asset tied to one specific lot, the same grain cannot be pledged twice, and a lender can confirm the collateral exists and is unencumbered before advancing against it. The farmer borrows against stored grain to cover immediate needs, then sells when prices recover and the receipt is redeemed or transferred to the buyer. The smallest viable version is one certified warehouse working with one cooperative: the warehouse grades and attests deposits, receipts are issued against them, and a single lender finances against the receipts. Independent grading and a registry of accredited warehouses can come once the model holds.

## Why Ethereum

Today the warehouse operator holds the receipt registry, so it can pledge the same lot to several lenders at once, and no lender can independently confirm that a given lot is still unencumbered. That single point of trust is what fails when an operator quietly double-pledges its inventory, and one collapse shuts smallholders out of storage finance for years afterward. Issuing each receipt as a unique onchain asset puts the record of what is pledged outside the operator's sole control, so any lender or buyer can verify that a lot is unencumbered before advancing against it, and the same grain cannot back two loans. What the chain does not fix is the attestation at the door: the warehouse still grades and vouches that the grain is there, so honest grading and a registry of accredited warehouses remain the part this does not solve on its own.
