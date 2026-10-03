---
title: "IP registration and prior art"
domains: science, media
desires:
  - creator/prove-i-made-this
  - researcher/prove-i-made-this
---

## Problem

Creators establishing when a work was made, and inventors establishing priority in a patent dispute, both lean on registries that are slow, costly, and split across jurisdictions. A patent office can take years and covers only its own country, so proving you were first somewhere else means filing again and again. Inventors keep lab notebooks and experimental data as their evidence of priority, but a notebook's dates rest on the institution's word and can be challenged as backdated. Creators face the mirror of this: platform timestamps can be rewritten by the platform that holds them, and a screenshot proves little once authorship is contested.

## Solution

A way to commit a cryptographic hash of a work, or of an invention's records, at the moment it exists, producing a timestamp anyone can verify without filing separately in each jurisdiction. The hash reveals nothing about the content until the holder chooses to disclose it, so an inventor can fix the date of a notebook entry or a dataset, and a creator can fix the date of a manuscript or master, while keeping the work private until they are ready. When a dispute arises, the holder reveals the original and shows it matches the committed hash.

A workable starting point is a thin "commit a hash, get a timestamp" tool aimed at one community that already fights priority battles, such as research labs logging experimental results or designers registering portfolios. Legal recognition and integrations with patent filings build on top of the same record.

## Why Ethereum

A registry run by one office or company decides which records stand, can be pressured to backdate or revoke entries, and leaves the holder dependent on its goodwill in every jurisdiction at once. Recording a timestamp on neutral rails keeps the proof of when something existed verifiable by anyone, with no operator able to alter the history after the fact or charge for the proof to be honored across borders.
