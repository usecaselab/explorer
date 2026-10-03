---
title: "Digital vehicle passports"
domains: logistics-and-trade
desires:
  - shopper/verify-what-im-buying
---

## Problem

A used-car buyer cannot see a vehicle's full history because it is scattered across systems that do not talk to each other. Manufacturing specs sit with the maker, ownership transfers and liens with government registries, accident damage with insurers, and service history with dealers and independent garages. No single party holds the complete record, and each one shows only its own slice, which is what makes title fraud and odometer rollback easy: a seller can roll back the clock or hide a salvage title because the buyer has no consolidated record to check against. The cost lands on the buyer, who overpays for a car worth far less.

## Solution

A vehicle passport that accumulates signed records across the car's life: manufacturing specs at the factory, each ownership transfer and lien, accident and repair events, odometer readings at service, and eventual scrappage. Each entry is attested by the party in a position to know (the maker, the registry, the insurer, the garage), so the passport functions as both a lifecycle record and a verifiable title that travels with the vehicle rather than living in any one company's database.

A workable starting point is odometer readings and title transfers in a single jurisdiction, captured at the points cars already pass through, such as annual inspection and registration renewal. That alone kills the two most common frauds, and service and accident history attach to the same record over time.

## Why Ethereum

A vehicle history service run by one company controls which records are shown, can be pressured to omit damage a dealer wants hidden, and leaves a buyer trusting a database they cannot inspect. Recording the lifecycle onchain keeps the chain of ownership and maintenance verifiable by anyone, so title fraud and odometer rollback show up against a record no single operator can quietly edit.
