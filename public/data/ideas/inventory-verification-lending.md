---
title: "Cross-party inventory verification and inventory-backed lending"
domains: logistics-and-trade, finance
desires:
  - manufacturer/access-to-credit
---

## Problem

Lenders that finance inventory have no independent way to confirm that pledged goods actually exist, have not already been pledged to another lender, and match what the borrower claims. Inventory records sit in disconnected systems across warehouses, suppliers, and retailers, with no single source any lender can check, so the same lot can back several loans at once without anyone seeing the overlap. This is a market worth well over 600 billion dollars, and it is exposed to warehouse-receipt fraud: in the Qingdao metals scandal, the same copper and aluminum stockpiles were pledged to multiple banks simultaneously, and the banks that lent against them took the loss. Honest borrowers pay for the risk too, since lenders price the possibility of fraud into every facility or decline to lend at all.

## Solution

Issue warehouse receipts as onchain tokens, each one tied to a specific lot in a specific warehouse and transferable only by the holder of record. Ownership and any pledge against a receipt live in one place every lender can read, so before extending credit a lender checks whether the lot is already encumbered, and a receipt cannot be quietly handed to two parties at once. When the goods leave the warehouse the receipt is retired, closing the loop between the physical lot and the claim against it.

A workable starting point is a single high-value, fungible commodity in bonded or third-party warehouses that already issue receipts, such as graded metals or agricultural staples, where a licensed warehouse operator signs each receipt as it is created. Field audits, insurance, and liquidation stay exactly as they are today.

## Why Ethereum

A warehouse receipt system run by one operator leaves lenders trusting whoever maintains the database, and the Qingdao scandal showed how easily disconnected records hide the same inventory pledged many times. Putting receipts onchain gives every lender the same ownership record to check independently, so a receipt cannot be quietly handed to two parties and no one operator controls what the books say.
