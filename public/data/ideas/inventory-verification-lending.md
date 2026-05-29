---
title: "Cross-party inventory verification and inventory-backed lending"
domains: logistics-and-trade, finance
desires:
  - manufacturer/access-to-credit
---

## Problem

Lenders offering inventory financing have no independent way to verify that pledged inventory actually exists, hasn't been double-pledged to another lender, and matches the borrower's representations — a $600B+ market plagued by warehouse receipt fraud (e.g., the Qingdao metals scandal where the same copper and aluminum were pledged to multiple banks simultaneously). The underlying issue is that inventory records across warehouses, suppliers, and retailers are maintained in disconnected systems with no single source of truth.

## Solution

Tokenized warehouse receipts linked to verified physical inventory — with each receipt representing a specific lot in a specific warehouse, ownership transferable onchain, and double-pledging detectable by any lender checking the onchain record before extending credit.

## Why Ethereum

A warehouse receipt system run by one operator leaves lenders trusting whoever maintains the database, and the Qingdao scandal showed how easily disconnected records hide the same inventory pledged many times. Putting receipts onchain gives every lender the same ownership record to check independently, so a receipt cannot be quietly handed to two parties and no one operator controls what the books say.
