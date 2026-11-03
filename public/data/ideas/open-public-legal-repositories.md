---
title: "Open & Public Legal Repositories"
domains: ai, government
---

## Problem

Whoever keeps the record of the law decides what the law was, and that keeper has always been a party with its own interests. Today the keepers are government publishers, legal databases and, more and more, AI labs. AI models draft legal text, are now where most people look law up, and hold their own governing rules: model specs, system prompts, rater guidelines and weights. When a publisher or lab quietly edits, drops or backdates one of these texts, the people bound by it can't prove what it said before. In August 2025, for example, the Library of Congress's Constitution Annotated site was briefly missing parts of Article I, and the Library called it a coding error. The only way to catch a change like that is to check a copy the keeper doesn't control. Today no such neutral copy exists.

## Solution

An accession ledger on Ethereum, modeled on Certificate Transparency. Publishers, courts, agencies and AI developers keep drafting and hosting their own texts. They just commit each version to a public log. Each entry records:

- a hash of the document
- what kind of document it is
- who committed it
- a pointer to the version it replaces
- the period it's in effect
- a timestamp set by the chain, not by the party committing it

Anyone can then check that a text matches the version that was committed, see exactly what changed between versions and when, and log their own dated challenge to it. The ledger proves provenance, not truth or legality: it shows that this party committed this text at this time. That's enough to stop the record from being rewritten in secret.

## Why Ethereum

A real archive has to be open for adding, impossible to rewrite, and timestamped by a process no contributor controls. A centralized platform fails the second and third tests. Its owner can edit or delete history, the same way a git repo owner can rebase or force-push. Signed mirrors and RFC 3161 timestamp services help, but they still rely on a trusted operator. Ethereum is the first record that people bound by a text can check without asking its author's permission. It also fits the government-edicts doctrine, which says no one can own the law. If everyone owns the law, no single party should keep it, and a chain whose security comes from everyone it binds is built for that job.
