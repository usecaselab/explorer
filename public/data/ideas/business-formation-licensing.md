---
title: "Business formation and licensing"
domains: government, business-operations
---

## Problem

Starting a business in most jurisdictions means coordinating with four to six separate agencies: the secretary of state for the entity, the IRS for an EIN, the state revenue department for sales-tax registration, the local government for a business license, and often a regulator for industry-specific licensing. Each has its own form, its own processing window, and its own way of communicating status. A founder waits weeks for paperwork that any of the agencies could in principle confirm in seconds, and any later proof to a bank, payment processor, or platform that the entity exists in good standing means going back to each issuer for a new certificate.

## Solution

A coordinated workflow where each agency issues its piece (incorporation, EIN, license, sales-tax registration) as a verifiable credential the founder holds, with signoffs anchored against issuer signing keys onchain. The founder reuses the same credential bundle to open a bank account, sign up with a processor, or apply for a contract, and a counterparty checks each piece against the issuing agency directly without that agency needing to operate a real-time lookup service.

## Why Ethereum

When business credentials are scattered across agency portals and paper certificates, anyone who needs to verify a founder's standing depends on whichever agency happens to have a working API or a willing clerk. Issuing the credentials onchain against state and federal signing keys lets the founder present them anywhere, and a bank or counterparty checks the actual issuer's signature rather than a vendor's claim about what the agency says.
