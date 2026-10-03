---
title: "Rent affordability proofs without oversharing"
domains: identity, real-estate-and-housing
desires:
  - renter/prove-income-without-oversharing
---

## Problem

To rent a flat a tenant is asked for bank statements, recent pay slips, and sometimes full read access to a bank account, all of it just to show their income clears the multiple of rent the landlord requires. That pile of financial detail then sits in a landlord's inbox or an agency's drive, far more than the yes-or-no question needed, waiting to leak or to be used to judge the applicant on spending they never meant to disclose. Tenants who are perfectly able to pay either overshare or lose the unit to someone who did. The applicant carries all the breach risk for a single threshold check.

## Solution

A zero-knowledge proof that a tenant's income exceeds the rent by the required multiple, generated from a source the landlord trusts (a payroll system, a bank, a tax record), revealing only whether the threshold is met and nothing about the actual figure, the employer, or the rest of the account. The landlord integrates a check that returns true or false against the rent they set, and the tenant proves they qualify without handing over a single statement. A workable starting point is one common threshold, income at or above three times the monthly rent, proved from an existing payroll or bank connection via zkTLS and accepted by one large property manager. Proving across several income sources, and reusable proofs a tenant can present to multiple landlords, come later.

## Why Ethereum

The data minimization here is the proof's doing, not the chain's: a landlord checks a true-or-false income proof locally, and that step needs no blockchain. The proof is the core. What the chain provides is the trust registry around it. A landlord has to know which payroll providers, banks, and tax sources issued the verification keys a proof is checked against, and which of those have since been compromised or revoked. A neutral public registry of accepted income-data oracles, one no single screening vendor controls, lets any landlord confirm a proof was built from a source they trust and reject one whose issuer has been pulled, without every landlord deferring to one aggregator's allowlist.
