---
title: "Provable AI adjudicators"
domains: ai
desires:
  - civic-participant/verify-public-decisions
  - patient/appeal-automated-decisions
---

## Problem

AI is starting to make binding decisions: settling insurance claims, allocating grants, arbitrating disputes, moderating what stays up. When an AI reaches a verdict, the people affected have no way to confirm which model and inputs produced it. The operator can quietly swap in a cheaper or biased model, or deny that a decision was tampered with, and the party the decision went against has no recourse.

## Solution

AI adjudicators that attach a proof to every verdict, showing that the disclosed model ran on the stated inputs to reach the recorded decision. The model's identity, the rules it was given, and the case inputs are committed onchain before a decision issues, and the verdict carries a verifiable trace anyone affected can check. A claimant, applicant, or party to a dispute can confirm that the system deciding their case is the one everyone agreed to, that its weights were not quietly swapped for a cheaper or more biased model, and that the output was not edited after the fact.

A workable starting point is one narrow, high-volume decision where the inputs are already structured and the stakes are bounded, such as first-pass insurance claim triage or content-moderation appeals. The first version needs only a committed model hash, the case inputs recorded against each verdict, and a published rule for how a contested decision escalates to human review.

## Why Ethereum

When the operator of an AI adjudicator is the only one who knows which model decided a case, the party it ruled against has to take the operator's word for it. Anchoring each verdict's proof onchain lets anyone check which model ran and on what inputs, so an AI making binding decisions answers to a record outside its operator's control.
