---
title: "Portable developer identity across forges"
domains: identity, business-operations
desires:
  - oss-maintainer/identity-across-forges
---

## Problem

A developer's reputation, the commits, reviews, issues, and releases that prove what they have built, usually lives inside a single platform's account. If that account is suspended, if the company is acquired and the product wound down, or if the developer moves to Codeberg or a self-hosted forge, the history does not travel with them. Contributions made under a since-deleted account, or on a forge that later shut down, simply disappear from the record. A maintainer who has spent a decade on open source can be left rebuilding proof of their own work from screenshots and the memory of people who happened to be there.

## Solution

A developer-controlled identity that contributions attach to, attested onchain, so a maintainer's history is anchored to a key they hold rather than to any one platform's account. When work is merged, the forge or the project signs an attestation tying the contribution to the developer's identity, and the developer collects these across GitHub, Codeberg, and self-hosted instances into one record that survives any single platform. A verifier resolving the identity sees the full cross-forge history without asking a host for permission. A workable starting point is a CI action or browser tool that signs an attestation for each merged pull request and links it to the contributor's key, building a portable record one project at a time. Reputation scoring and forge-native integration can follow once the attestations exist.

## Why Ethereum

A forge-signed attestation a developer holds in their own wallet already verifies without anyone's help, so the chain is not there to vouch for a signature. What it adds is a public append-only timestamp: each merged contribution is recorded when it happens, so a developer cannot backdate work and a platform cannot retroactively deny that a since-deleted account ever shipped it. And the attestations from GitHub, Codeberg, and self-hosted forges resolve through one neutral cross-forge registry no single platform operates, so a developer's contribution history exists in a place none of them can quietly erase, take offline, or refuse to serve.
