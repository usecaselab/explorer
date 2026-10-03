---
title: "Milestone-based scholarship and grant disbursement"
domains: finance, civil-society
desires:
  - donor/pay-for-outcomes
---

## Problem

Education grants and scholarships from foundations, governments, and endowments are usually paid upfront with little accountability for what happens next. A foundation funding two hundred scholarships across fifty institutions has no programmatic way to confirm that recipients stayed enrolled, completed coursework, or held a required GPA before the next tranche goes out. It relies instead on status updates self-reported by institutions that have a financial reason to keep students on the books whether or not they are progressing. The result is money disbursed against promises, with the funder learning how it actually went, if at all, long after the fact.

## Solution

A scholarship fund held in a smart contract that releases tuition in tranches as milestones are attested, such as enrollment confirmed, credits completed, or a GPA threshold maintained. Each release condition and each attestation is recorded, so a funder can see across its whole portfolio which milestones were met and which payments followed, rather than trusting a stack of self-reported summaries. The institution still verifies the academic facts, but it can no longer draw the next tranche simply by asserting a student is on track.

A workable starting point is one funder and a handful of institutions agreeing on two or three machine-checkable milestones for a single cohort, with the disbursement rules and the record of payments visible to the funder. Richer outcome measures and pooling across many funders can come later.

## Why Ethereum

When disbursement runs through a single administrator, funders rely on self-reported status from institutions that have a financial reason to keep drawing funds whether or not students are progressing. Building the scholarship fund onchain keeps the release conditions and the record of each milestone and payment verifiable by funders directly, so accountability does not rest on trusting the institution's own reporting.
