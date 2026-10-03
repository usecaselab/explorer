---
title: "Self-custody with social recovery"
domains:
  - identity
  - finance
desires:
  - investor/self-custody
  - investor/portable-portfolio
---

## Problem

Self-custody today still carries a brutal failure mode: lose the seed phrase or the device and the assets are gone, with no one to call. That single point of catastrophic loss is the main reason most people keep their savings with a custodian instead, accepting that the custodian can freeze, seize, or lose the account in exchange for a reset-my-password button. The same gap shows up when an owner dies and heirs cannot reach the wallet, or when a phone is stolen and a thief drains everything before anyone can intervene. People are forced to choose between sovereignty with no safety net and a safety net that hands control back to a third party.

## Solution

A smart-contract account whose recovery is governed by rules the owner sets, not by any single key or company. The owner designates a set of guardians (a friend, a family member, a hardware key in a drawer, a professional service), and a majority can together restore access if the primary key is lost, while no single guardian can move funds or act alone. Spending limits, time-locks, and inheritance conditions live in the same account, so a stolen key is bounded and heirs can claim assets when agreed conditions are met. A workable starting point is a recovery wallet for everyday holders that ships with a small, intuitive guardian set (a second device, one trusted person, and a delay), defaulting people into self-custody that no longer means one mistake erases everything. Richer guardian policies and inheritance flows can layer on top.

## Why Ethereum

The entire point is to remove the custodian without reintroducing a single point of failure, and that only works if the recovery logic runs on rails no one party controls. A bank or wallet company offering "social recovery" still holds the override, so it can still freeze or seize the account, which puts the user back where they started. Programmable accounts on a neutral chain let the recovery rules be enforced by code the owner chose and anyone can verify, so the user keeps custody and a safety net at the same time, with no institution able to revoke either.
