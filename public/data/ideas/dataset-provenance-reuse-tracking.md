---
title: "Dataset provenance and reuse tracking"
domains: science
desires:
  - researcher/paid-for-value-i-drive
---

## Problem

Researchers who build high-quality datasets spend months curating, cleaning, and annotating data, then receive little academic credit when other people use it. Citation practice rewards the paper that analyzed the data, not the team that produced it, and reuse is tracked informally if it is tracked at all. A footnote thank-you, where it appears, does not feed the citation counts that grant and tenure committees actually weigh. Meanwhile a researcher building on a published dataset often cannot confirm they are holding the same version that produced the original findings, because files get re-uploaded, silently corrected, or mirrored without any version history.

## Solution

A registry where each dataset is cryptographically fingerprinted when it is deposited, and every later download, citation, or derived dataset is recorded against that fingerprint. Producers get a verifiable count of how their data has been reused, one that committees and funders can check rather than take on faith, and downstream researchers can confirm the file they hold matches the version behind a given paper. When a dataset is updated, the new fingerprint links back to the old one, so the version history stays legible instead of being overwritten.

A workable starting point is one field with an active data-sharing culture, such as genomics or astronomy, where a single repository fingerprints deposits and journals in that field record the fingerprint in each paper's data-availability statement. Automated citation payments and cross-repository tracking come later.

## Why Ethereum

A reuse registry held by one repository or publisher leaves dataset producers depending on that operator to count citations fairly, keep serving the records, and not revise them when it suits a partner. Fingerprinting data and recording each use onchain keeps the citation trail outside any single operator's control, lets a producer carry proof of reuse between institutions, and lets downstream researchers verify integrity themselves rather than trusting the host.
