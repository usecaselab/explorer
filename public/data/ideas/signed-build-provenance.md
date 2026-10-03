---
title: "Signed build provenance for software releases"
domains: business-operations, identity
desires:
  - oss-maintainer/trustworthy-builds
---

## Problem

A maintainer publishes reviewed source on a public forge, but the binary or package that lands in a downstream install is built somewhere else, often by a CI pipeline or a distribution packager, and the developer running `npm install` or `apt-get` has no cheap way to confirm the artifact they received was built from that source. The xz backdoor showed how an attacker who compromises a release account, a build server, or a single trusted contributor can slip a tampered build into the supply chain, where it can sit undetected in millions of systems for months. Existing signing schemes lean on a key the attacker may have stolen and on a transparency log the signing vendor itself runs and could rewrite or take offline. The maintainer, after the fact, often cannot even prove what they actually shipped.

## Solution

A release attestation committed onchain that binds a specific artifact hash to the source commit, the build inputs, and the maintainer's identity, so any installer or CI step can recompute the hash and check it against an immutable record before trusting the build. When a maintainer cuts a release, the build pipeline publishes a signed statement linking the artifact digest to the exact source it came from, and that statement is anchored onchain where it cannot be silently altered or removed. A package manager or CI gate fetches the attestation, compares digests, and refuses anything that does not match. A workable starting point is one registry adding an optional verify step that checks a single maintainer's onchain attestations and warns when an installed artifact has no matching record. Reproducible-build cross-checks and multi-party signing can come later.

## Why Ethereum

When the signing key, the transparency log, and the registry all sit with one vendor, an attacker who reaches that vendor can forge or erase the very record meant to catch them, and the maintainer is left unable to prove what they released. An append-only log like Sigstore's Rekor helps, but it still has an operator who can take it offline or, with enough collusion, rewrite what it holds. Anchoring the attestation onchain puts the binding between source and artifact somewhere no single registry or build host controls and no operator can pull, so any installer can verify provenance permissionlessly without trusting the platform that distributed the package, and a tampered build has nowhere to hide.
