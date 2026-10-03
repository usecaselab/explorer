---
title: "Budget execution tracking"
domains: government
desires:
  - civic-participant/audit-public-money
---

## Problem

Public funds flow through fragmented accounting systems between the moment a budget is appropriated and the moment money actually leaves the treasury, and the systems that record each hop are controlled by the agencies doing the spending. Citizens and auditors get summary reports that arrive a year out of date and roll thousands of transactions into a single line, so tracing how a specific appropriation turned into specific vendor payments is nearly impossible. By the time a discrepancy surfaces in an annual audit, the officials involved have often moved on and the records can no longer be reconciled. The people with the strongest interest in following the money, the residents who paid the taxes, are the ones with the least access to the trail.

## Solution

Public spending recorded onchain as it executes, with each transfer traceable from the appropriation that authorized it through to the vendor that received it. Instead of a year-end report compiled by the spending agency, residents and auditors watch funds move in real time against the budget line each payment is drawn from, and a payment that does not match an authorized line stands out immediately rather than surfacing in a later reconciliation.

A workable starting point is one well-bounded fund where the flow is already digital and politically salient, such as a disaster-relief allocation or a single capital project, published onchain alongside the conventional ledger. Once that fund's trail is auditable end to end, the same pattern extends to departmental budgets and recurring expenditure.

## Why Ethereum

When the government keeps its own spending records, the body being audited also controls the records, and it can present a partial picture or revise entries before anyone outside sees them. Recording appropriations and expenditures onchain puts the trail where citizens and auditors can follow it directly, without depending on the agency's cooperation to confirm where tax revenue went.
