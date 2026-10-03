---
title: "Wills and estate execution"
domains: civil-society
desires:
  - homeowner/faster-closings
  - investor/portable-portfolio
---

## Problem

When someone dies, moving their assets to their heirs runs through probate, a court process that routinely takes months or years, plus a bank or executor that controls the accounts in the meantime. A trust meant to avoid that still depends on a fiduciary who manually manages distributions and reporting, often across several jurisdictions, and the beneficiaries mostly have to take the fiduciary's word for what the estate holds and when they will see it. An heir who suspects delay or self-dealing has little practical recourse short of litigation. The people the assets are meant for end up waiting on, and trusting, the very parties who benefit from holding the money longer.

## Solution

Estate and trust logic encoded in a smart contract, where assets held onchain pass to beneficiaries automatically when verifiable conditions are met: a death attested by a registry oracle, a beneficiary reaching a set age, a date arriving, rather than waiting on a court calendar or an executor's discretion. The distribution rules and the current holdings are visible to every heir, so nobody has to trust a fiduciary's account of what is in the estate, and the schedule executes the same way whether or not the administrator is paying attention.

A workable starting point is a single revocable arrangement over assets already held onchain: a settlor sets beneficiaries and release conditions, a small set of attestations triggers distribution, and reporting is just the public record any heir can read. Bridging real-world assets and probate-court recognition can come as the legal wrappers mature.

## Why Ethereum

When estate execution runs through a court, a bank, or a single executor, the people who hold the assets also decide when and whether to release them, and a beneficiary has little recourse against delay or self-dealing. Building the trust logic onchain keeps the release conditions and the record visible to every heir, so distribution follows rules nobody can quietly rewrite.
