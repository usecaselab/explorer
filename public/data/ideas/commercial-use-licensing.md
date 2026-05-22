---
title: "Commercial-use licensing for open source"
domains: business-operations, finance
---

## Problem

A maintainer is fine with their library being free for individuals, students, and research, and would prefer commercial users that integrate it into paid products to pay a license fee. The current options are bad: keep the license fully permissive and watch a vendor charge six figures for a hosted version of the work, relicense to AGPL and accept a fight with every commercial user, or move to a source-available license and accept the cost of policing it. None of these scale to a single maintainer with a day job.

## Solution

A dual-licensing model where commercial use is gated by an onchain license token. The maintainer publishes the terms, commercial users acquire the token by paying a fee that flows directly to the project's address, and the build or runtime checks the presence of a valid license tied to the user's identity. Compliance is cheaper than litigation, the maintainer does not need a legal department, and individual or non-commercial use stays untouched.

## Why Ethereum

License enforcement at the scale of an indie maintainer fails because the cost of detecting non-compliance and the cost of pursuing it are both higher than the license fee. Issuing license tokens onchain, with a public price and a verifiable record of who holds one, shifts the work from enforcement to verification: any party in the supply chain can check whether a commercial deployment holds a current license, and the maintainer collects the fee without negotiating individually with each vendor.
