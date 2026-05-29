---
title: "Data integrity for decentralized clinical trials"
domains: health, science
desires:
  - patient/trust-the-evidence
  - researcher/data-integrity
---

## Problem

Decentralized clinical trials let patients participate from home using wearables, symptom-reporting apps, and telemedicine, which means data is collected across hundreds of patient devices rather than at monitored investigator sites. That makes it harder for sponsors and regulators to be confident that electronic source data has not been altered, that consent was properly obtained, and that the chain of custody from device to database is intact.

## Solution

Each sensor reading, patient-reported outcome, and consent signature is hashed and timestamped at the moment it is captured. That creates an audit trail showing the data has not been changed since collection, giving monitors, sponsors, and regulators confidence in source data integrity without depending on physical site visits.

## Why Ethereum

When trial data lives in a sponsor-controlled database, the party with the most to gain from a positive result also holds the ability to alter source records, and regulators have to take the chain of custody on trust. Committing each reading and consent signature onchain at the moment of capture keeps the record verifiable by monitors and regulators without depending on the sponsor's cooperation.
