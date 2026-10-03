---
title: "Transparent, appealable health-insurance claims"
domains: health, insurance
desires:
  - patient/appeal-automated-decisions
---

## Problem

A patient whose treatment is denied by their health insurer often cannot see which rule produced the decision. Automated utilization-management systems reject claims and prior-authorization requests at scale, and the insurer that wrote the coverage rules, holds the claim data, and books the saving from each denial is also the one that hears the first appeal. Patients and their doctors lose hours resubmitting and phoning, and many simply give up on care they were entitled to. Because the adjudication logic is proprietary, neither the patient nor an outside reviewer can confirm that the policy was applied consistently or that a denial actually matched the contract.

## Solution

Commit the plan's covered conditions and the criteria for a given procedure to a tamper-evident onchain record when the policy is sold, so the carrier cannot later reinterpret what the patient bought. When a claim is denied, the patient can check the decision against the criteria as they stood at purchase rather than against a rule the insurer has revised since, and carry that commitment into an independent appeal whose deadlines the contract enforces. The patient keeps a portable, verifiable copy of the terms they were sold.

A workable starting point is one narrow, high-denial procedure under a single plan: commit the coverage criteria at sale and give patients a receipt they can hold against any later denial. A live trail logging which rule fired on each claim, and automatic payout on clear approvals, is the harder extension that depends on the carrier publishing records it would rather not.

## Why Ethereum

The piece a chain can genuinely secure here is the commitment made at the start. When the insurer holds the coverage rules, it can reinterpret after the fact what a policy covered, and the patient has no fixed reference to argue against. Committing the criteria to a tamper-evident onchain record at policy-sale time fixes what was bought, so the carrier cannot quietly rewrite the terms between the sale and the denial, and the patient carries a reference an outside arbiter can check without the insurer's permission. A live, claim-by-claim adjudication trail would be stronger still, but it needs the insurer to honestly publish its own records, which the same insurer has every reason to withhold; that is the aspirational extension rather than the part the chain can guarantee on its own.
