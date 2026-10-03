---
title: "Age and eligibility proofs without identity disclosure"
domains: identity
desires:
  - shopper/prove-without-revealing
---

## Problem

A teenager who needs to prove they are over 18 to open an account, or a doctor who needs to prove they hold a current license to prescribe remotely, is usually asked to upload a full government ID. The site needed only a single yes or no answer, but it now holds a scan carrying the person's date of birth, photo, address, and document number, sitting on a server waiting to be breached. Age-verification mandates are spreading across jurisdictions, so the number of unrelated companies collecting the same documents keeps growing. Each one becomes both a surveillance point that logs which sites a person unlocks and a future leak of the most sensitive identity data they have.

## Solution

A credential a person holds themselves, issued once by an authority that already knows the underlying facts (a government, a licensing board, a bank), that lets them generate a zero-knowledge proof of a single claim: over 18, licensed physician, accredited investor. The verifying site learns only that the claim is true, never the birth date, the name, or the document it was derived from, and it never receives a copy to store. A workable starting point is one high-friction check where the document and the answer are badly mismatched, such as age gating for adult or alcohol sites, built on a proof derived from an existing government eID or mobile driving license. The verifier integrates a check that returns true or false, and issuance and revocation stay with the authority that already runs them.

## Why Ethereum

A centralized verification vendor sits between every site and every user, so it sees the full map of who unlocked what and accumulates everyone's identity documents in one place that becomes a prime breach target. Anchoring the credentials and the proof verification on a neutral chain lets any site check a claim without routing the user through a company that can log, sell, or leak the activity, and without that company becoming the gatekeeper that decides which sites get to verify at all. The user proves the minimum and carries the credential themselves rather than re-uploading the source document to each new counterparty.
