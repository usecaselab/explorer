---
title: "Privacy-preserving KYC and sanctions screening proofs"
domains: business-operations, government
desires:
  - merchant/prove-without-revealing
  - shopper/prove-without-revealing
---

## Problem

Every bank, payment processor, and B2B marketplace that onboards a customer runs its own KYC and sanctions screening from scratch, collecting the same passport scans, company papers, and beneficial-ownership records the last institution already holds. Each check costs somewhere between $50 and $500 per customer, and each copy of the documents becomes one more breach target sitting on one more server. Cross-border payments make it worse: a European bank paying a US correspondent has to show OFAC and EU sanctions compliance, which today means handing the counterparty enough customer data to screen independently. That forces a choice between protecting the customer's data and satisfying the regulator, and the customer, who never sees any of this, carries the breach risk either way.

## Solution

Let an institution that has already screened a customer issue a reusable proof of that fact, and let other institutions verify it with a zero-knowledge proof instead of re-collecting the documents. The proof attests that a named, accredited screener checked this party against current sanctions and KYC requirements and found them clear, without revealing the underlying identity records, so a counterparty satisfies its own obligation without ever receiving data it then has to guard.

A workable starting point is reusable screening inside a single consortium whose members already trust one another's compliance teams, such as a group of correspondent banks or a B2B marketplace and its onboarded sellers, with one accredited screener issuing proofs the others accept. Broader cross-jurisdiction recognition and revocation handling can follow once the proof format is trusted.

## Why Ethereum

The current process forces a customer's identity documents to be copied into every institution that onboards them, leaving sensitive data scattered across many breach targets and handed to each counterparty. Zero-knowledge proofs onchain let an institution show that screening was done without surrendering the underlying records, so the data stays with the customer rather than accumulating wherever a transaction goes. Because the proof is anchored to neutral rails, any counterparty can verify it without joining a shared private vendor that would then sit between every institution and decide who is allowed to check.
