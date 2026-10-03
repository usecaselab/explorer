---
title: "Earnings-backed advances for gig workers"
domains: finance
desires:
  - gig-worker/access-to-credit
---

## Problem

Gig and platform workers routinely need cash before payday: a car repair on a Tuesday, rent due before the weekly payout clears. Banks will not lend to them because their income reads as irregular deposits, so they turn to payday lenders or earned-wage-access apps that advance against the next paycheck and take a fee. Those apps sit between the worker and the platform, custody the incoming wages, and decide on their own how much to advance and what to charge, often at effective rates that rival payday loans. The worker, whose own future earnings are the collateral, has the least control over the arrangement and the least visibility into what it actually costs.

## Solution

Let a worker borrow a small amount against earnings they have not yet been paid, with repayment routed automatically when the platform pays them. The platform deposits a completed shift's pay into a contract that forwards most of it to the worker and sends the agreed repayment to whoever funded the advance, so the loan clears from the earnings stream itself rather than from a separate collection effort. Pricing draws on the worker's own verifiable payment history, and every fee and deduction is visible before they accept.

A workable starting point is one platform and one funding pool offering a capped advance against pay already earned but not yet disbursed, repaid from the next payout. Larger advances against projected future work, and portability across platforms, can come later.

## Why Ethereum

A neutral escrow with a trustee can already keep a worker's wages out of the lender's account, so custody alone is not the Ethereum case. What a single platform's database cannot neutrally provide is a portable earnings record the worker carries between apps, so the payment history that prices the advance is theirs rather than locked inside whichever platform holds this week's work. On the same record, anyone can fund the pool: a cooperative, the workers themselves, or competing lenders bidding on the rate, instead of one incumbent app that custodies the wages and sets the price unopposed. Routing the advance and its repayment through an onchain contract then makes every fee and deduction visible to both sides, so the worker can see and contest the math whoever funds it.
