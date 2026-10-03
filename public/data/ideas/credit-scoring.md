---
title: "Credit scoring from off-chain financial history"
domains: finance
desires:
  - gig-worker/access-to-credit
---

## Problem

Hundreds of millions of people are creditworthy without being legible to a lender. They pay rent on time, keep savings, and run profitable small businesses, but that history lives inside bank apps, rental platforms, and payroll systems a lender cannot see. The only way to share it today is to hand a lender raw account credentials or a full data export, exposing everything to underwrite a single number. People with thin or no credit files, including gig workers paid across several platforms, get declined not because they cannot pay but because the proof that they could is locked where the lender cannot reach it.

## Solution

A borrower proves specific financial claims straight from the source platform without handing over login credentials or a full account dump. Using zkTLS, they generate a proof that rent was paid on time for twelve months, that their salary clears a threshold, or that business revenue ran above a level, and a lender verifies that proof without ever seeing the underlying account. The lender gets underwriting data it can trust, and the borrower reveals only the fact that matters while keeping the rest private.

A workable starting point is the single claim a thin-file borrower most needs to prove, such as a year of on-time rent or steady platform earnings, accepted by one lender that already wants to serve that group. Scoring across many sources at once and reusable proofs a borrower can present to several lenders come later.

## Why Ethereum

A data aggregator standing between borrowers and lenders collects raw account credentials and financial history into one store that becomes a surveillance point and a breach target. Building this with zero-knowledge proofs onchain lets a borrower prove a specific claim, like a year of on-time rent, without handing over the underlying account, and keeps the check from being logged by a company in the middle.
