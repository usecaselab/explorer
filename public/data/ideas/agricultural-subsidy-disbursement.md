---
title: "Agricultural subsidy disbursement"
domains: government, food-and-agriculture
desires:
  - farmer/get-paid-faster
---

## Problem

Agricultural subsidy programs such as the EU Common Agricultural Policy direct payments and USDA conservation programs require farmers to submit annual applications, undergo eligibility reviews, and wait months for payment. Administrative overhead consumes a significant share of program budgets, and the delays fall hardest on the smaller farms that need operating capital at the start of the season. Eligibility conditions like acreage verification, crop compliance, and conservation practice adoption are checked manually by inspectors who can physically visit only a fraction of enrolled farms each year, so most approvals rest on paperwork an administrator chooses when to process.

## Solution

Subsidy disbursements that execute against verified eligibility data rather than an inspector's queue. Satellite imagery confirms planted acreage and crop type, attestations from agronomists or cooperatives confirm conservation practices, and once the conditions a program already publishes are met, the payment releases to the farmer onchain at the start of the season instead of months after the application clears review. The rule and the release sit together, so a farmer can see exactly which condition is still outstanding rather than waiting on an opaque approval.

A workable starting point is one payment line with a clean remote-sensing trigger, such as an acreage-based direct payment in a single region, run alongside the existing manual process as a parallel proof. Conservation practices that need ground inspection, and full program migration, come later once the satellite-triggered payments have a track record.

## Why Ethereum

When subsidy payments depend on manual review, the agency controls the pace and the discretion, and farmers wait months while inspectors reach only a fraction of enrolled farms. Tying disbursement to verified eligibility data onchain makes the rule and the release visible to everyone, so payment timing follows the criteria rather than an administrator's queue or judgment.
