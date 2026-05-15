---
title: "Firearm licensing and registration"
domains: government
---

## Problem

State firearm licensing (permit-to-purchase, FOID cards, concealed-carry permits) and state-level firearm registration sit in siloed, often paper-based systems that do not move with the holder across jurisdictions. A licensee crossing state lines, a transfer between residents of different states, or a buyer at a gun show in another state all run into systems that cannot verify each other's records, while federal law blocks the kind of centralized registry that would otherwise paper over the gap.

## Solution

Firearm licenses and registration records issued by states as verifiable credentials the holder carries, with selective disclosure so a check exposes only the specific fact in question, such as that a license is current and unrevoked. Verification anchors against the issuing state's signing key onchain, so a counterparty in another state can confirm a record without that state running a lookup service or anyone maintaining a federal database.

## Why Ethereum

A national firearm registry is politically blocked, and a single searchable database of who owns what could be queried, leaked, or weaponized. Issuing licenses and registration records as holder-controlled credentials, verifiable against state signing keys onchain, lets the system work across jurisdictions without any party maintaining the kind of central database the law forbids.
