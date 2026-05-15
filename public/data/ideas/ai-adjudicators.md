---
title: "Provable AI adjudicators"
domains: ai
---

## Problem

AI is starting to make binding decisions: settling insurance claims, allocating grants, arbitrating disputes, moderating what stays up. When an AI reaches a verdict, the people affected have no way to confirm which model and inputs produced it. The operator can quietly swap in a cheaper or biased model, or deny that a decision was tampered with, and the party the decision went against has no recourse.

## Solution

AI adjudicators that carry a proof of how each verdict was reached, showing the disclosed model ran on the stated inputs. A claimant, applicant, or party to a dispute can check that the AI deciding their case is the one everyone agreed to, and that its decision was not swapped or edited after the fact.

## Why Ethereum

When the operator of an AI adjudicator is the only one who knows which model decided a case, the party it ruled against has to take the operator's word for it. Anchoring each verdict's proof onchain lets anyone check which model ran and on what inputs, so an AI making binding decisions answers to a record outside its operator's control.
