---
title: "Scientific knowledge graph"
domains: science
desires:
  - researcher/surface-what-the-field-believes
---

## Problem

Scientific knowledge is scattered across millions of papers and dozens of databases with no common layer connecting a finding to the data behind it, the studies that replicated or failed to replicate it, or the retraction that later revised it. Whether a given result still stands is genuinely hard to see: a retracted paper keeps getting cited for years, and a failed replication sits in a different journal the original's readers never reach. The connective tissue that does exist lives inside commercial indexes like Web of Science or Scopus, which charge for access and decide what links to what. Cross-domain connections, the finding in one field that answers a question in another, are mostly found by accident.

## Solution

A public knowledge graph that links each paper to its underlying data, its replications, its citations, and any retraction, maintained as shared infrastructure rather than inside one vendor's index. A researcher or an application can trace a finding's current standing, see at a glance whether it has been reproduced or pulled, and follow connections across disciplines without negotiating access to a proprietary database. Anyone can add edges and build tools on top, so the layer improves with use instead of being gated.

A workable starting point is one well-bounded corpus, such as the retraction and replication records for a single field, published as an open graph that existing tools can read and write. Curation incentives and broad cross-domain coverage build on that base once the core links are trusted and in use.

## Why Ethereum

A knowledge graph owned by one publisher or database vendor lets that operator decide which findings connect, who may build on the layer, and what access costs, recreating the silos the project set out to dissolve. Anchoring the graph's core records on neutral rails keeps the connective layer outside any single institution's control, so any researcher or application can link findings across disciplines, and check a result's standing, without asking permission or paying a gatekeeper.
