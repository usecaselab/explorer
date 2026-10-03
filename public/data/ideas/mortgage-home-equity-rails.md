---
title: "Mortgage & home-equity rails"
domains: real-estate-and-housing, finance
desires:
  - homeowner/transparent-mortgage
---

## Problem

A mortgage is sold and resold on the secondary market several times over its life, and the borrower is usually the last to know who currently holds the note. Servicing rights change hands through batch files reconciled across the private systems of banks, servicers, and securitization trusts, and errors in how a payment was applied or whether an escrow shortfall was real can sit unnoticed for years. When the borrower disputes a figure, they are arguing against records they have never been allowed to see, held by a servicer with no incentive to surface its own mistakes. The same opacity makes it hard for a borrower to refinance or for a competing lender to underwrite against the real payment history.

## Solution

Represent the loan and its servicing logic as an onchain record: the principal, the rate and any adjustments, each payment and how it was applied, and every assignment of the note as it trades. The borrower can verify the running balance and confirm the terms were applied correctly, and a transfer of servicing settles against a record both the old and new servicer share rather than a file one of them reconciles in private.

A workable starting point is a read-only payment and assignment ledger for loans a single originator already services, giving borrowers a verifiable view of who holds the note and how each payment landed, with servicing left exactly where it is today. Programmable escrow, automated payoff, and a permissionless secondary market can build on that once the record is trusted.

## Why Ethereum

When servicing and secondary trading run on the private systems of a few large institutions, borrowers cannot see who holds their loan or whether terms were applied correctly, and the records can be reconciled in ways they never observe. Putting the loan and its servicing logic onchain keeps the obligation auditable by the borrower and tradable without permission from a gatekeeper.
