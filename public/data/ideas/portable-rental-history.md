---
title: "Portable rental history and references"
domains: real-estate-and-housing, identity
desires:
  - renter/portable-rental-history
---

## Problem

Every rental application asks a tenant to prove they pay on time and leave places clean, but that record lives in the heads of past landlords and the files of agencies the tenant cannot access. A renter moving cities starts from zero each time, chasing former landlords for a reference letter that may never come, while applicants with a personal connection to the agent get the unit. Tenant-screening bureaus compile their own files, often with errors the tenant cannot see or correct, and sell them to landlords without the tenant ever holding a copy. The person whose track record it is has the least control over it.

## Solution

Let each landlord attest a tenant's payment history and conduct at move-out as a signed credential the tenant holds and carries to the next application, with the underlying rent payments provable from an onchain or bank record rather than a typed letter. A new landlord verifies a real track record (on-time payments across two years, deposit returned in full, lease completed) without the tenant chasing down old landlords, and the tenant presents the same history to any agency instead of rebuilding it each move. A workable starting point is move-out attestations issued through a property manager that already handles many units, so a departing tenant leaves with a signed record they can show the next one. A shared schema other landlords and screening services can read can follow.

## Why Ethereum

A landlord's signed move-out attestation verifies on its own, so the tenant simply holding the credential is not the part that needs a chain. Two things are. A past landlord who later regrets a good reference, or is leaned on by a screening bureau, should not be able to reach back and revoke a tenancy record the tenant already earned, so that record has to live somewhere its issuer no longer controls. And a new landlord must be able to read an attestation from a landlord they have never heard of, which only works if rental references resolve through one shared, neutral schema and registry any landlord or screening service can read and trust, rather than each property manager minting credentials only its own software understands.
