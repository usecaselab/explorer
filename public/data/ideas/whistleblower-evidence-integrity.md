---
title: "Whistleblower & evidence integrity"
domains: civil-society
desires:
  - journalist/censorship-resistant-comms
---

## Problem

A whistleblower with documents that implicate a powerful employer or government faces two failures at once: the channel they submit through can expose who they are, and the evidence itself can be altered or denied after the fact. Newsroom and NGO submission systems run on servers somebody owns, which can be subpoenaed, breached, or pressured into handing over logs that identify the source. The files carry metadata that can burn the sender, and once material sits in an organization's custody, that organization could quietly edit it, lose it, or be made to. By the time a leak matters in a court or an investigation, the target's first move is to claim the evidence was fabricated, and the source has no way to prove when it existed or that it has not been touched.

## Solution

A way to commit evidence, a document, a photograph, a dataset, to a tamper-evident timestamp the moment it is captured, while keeping the contents private until the source chooses to disclose them. A hash of the material is recorded onchain, so anyone can later confirm the file existed at that time and has not been altered, while the file itself stays encrypted off-chain and the submitter's identity never passes through a custodian that can be compelled to reveal it. Selective-disclosure proofs let a source show a court or a reporter exactly the part that matters without exposing the rest.

The smallest viable version is a drop tool for one newsroom: a contributor hashes and timestamps a document locally, hands the encrypted file to the reporter out of band, and the reporter can prove provenance and integrity without ever holding a record that links back to the source. Anonymous credentials proving a leaker is a genuine insider can come later.

## Why Ethereum

A whistleblower submission channel run by any single organization can be subpoenaed, breached, or pressured into exposing who sent what, and the same operator could quietly alter or lose the evidence. Recording timestamped, privacy-preserving submissions onchain means the source does not have to trust an intermediary that can be compelled against them.
