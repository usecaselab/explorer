---
title: "Parametric health insurance payouts"
domains: insurance, health
desires:
  - patient/get-paid-faster
---

## Problem

Many health insurance claims have simple, verifiable trigger conditions. A policyholder is admitted to a hospital, or completes a covered preventive visit, and is clearly eligible for a payout. These claims still move through the same weeks-long adjudication pipeline as complex cases that need medical review, adding administrative cost and delay to products whose whole value is paying out quickly during a health event.

## Solution

Parametric health benefit products where a payout triggers automatically once a standardized medical event is attested, such as a hospital admission confirmed by the facility or a logged preventive visit. Claims that do not need utilization review or a medical necessity determination settle within hours instead of weeks, and the trigger conditions are fixed in the policy where the policyholder can read them rather than buried in an adjudication workflow.

A workable starting point is a single benefit with an unambiguous, facility-confirmed trigger, such as a fixed hospital-admission cash benefit that pays on the admission record alone. The first version needs only an attested event feed from the facility and an escrow that releases the agreed amount, leaving everything that genuinely requires medical judgment on the existing pipeline.

## Why Ethereum

When the insurer alone controls the claims pipeline, it has an incentive to slow or deny payouts on products whose value depends on speed, and the policyholder has little recourse. Encoding the trigger conditions onchain means a clearly eligible event pays out on terms both sides agreed to in advance, without the payer being able to add friction after the fact.
