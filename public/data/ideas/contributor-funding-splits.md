---
title: "Contributor funding splits"
domains: business-operations, finance
desires:
  - oss-maintainer/split-funding-fairly
---

## Problem

Sponsorship for an open-source project almost always lands in one person's account, usually the original author or whoever set up the funding link. But the people keeping a mature project alive, the reviewers, the docs writers, the maintainer who triages issues every weekend, are often not that one person. The lead then has to either redistribute the money by hand, which is awkward and easy to let slide, or quietly keep it, which corrodes the volunteer goodwill the project runs on. Fiscal-host platforms like Open Collective improve on this by custodying the money and publishing the splits, but the funds still sit in the host's account, every payee has to be onboarded through it, and contributors in unsupported countries or who want to stay pseudonymous are simply left out. There is no standard way for a project itself to declare, in public, that incoming money divides automatically and on what terms, so contributors who carry real load have no claim on the support their work attracts.

## Solution

A split contract that incoming sponsorship flows straight into and that pays out to current contributors by shares the project sets and can update as the contributor base changes. The maintainers publish the recipient addresses and their weights, point the project's funding links at the contract, and every sponsorship that arrives divides automatically by the published rule rather than passing through one person's discretion. When someone steps up or steps back, the maintainers adjust the shares, and the change is visible to everyone the money touches. A workable starting point is a single active project replacing its personal funding link with one split across its three or four core maintainers at fixed weights. Contribution-weighted shares, vesting for newcomers, and time-bounded allocations can layer on later.

## Why Ethereum

Open Collective already shows the books, so transparency is not the gap. What a split contract changes is that no one ever custodies the pooled money: each sponsorship divides to its recipients at the moment it arrives, by the published rule, with no host holding the balance and no maintainer in a position to redirect or withhold it. And because anyone with an address can be a payee, a project can pay a pseudonymous contributor or someone in a country no fiscal host serves, with no intermediary deciding who is permitted to receive.
