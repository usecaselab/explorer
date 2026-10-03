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

Each sensor reading, patient-reported outcome, and consent signature is hashed and timestamped onchain at the moment it is captured on the patient's device, before it reaches the sponsor's database. That commitment lets a monitor or regulator later confirm that a given record matches what was collected and has not been edited, reordered, or backfilled, without depending on a physical visit to an investigator site. Consent versions and withdrawals are recorded the same way, so it is provable which version of the protocol a patient agreed to and exactly when.

A workable starting point is the consent and primary-endpoint data for a single decentralized trial: hash each event at capture, keep the raw data in the existing electronic system, and give regulators a verification tool that checks any record against its onchain commitment. Full source-data capture and cross-sponsor registries can follow once the verification step is trusted.

## Why Ethereum

When trial data lives in a sponsor-controlled database, the party with the most to gain from a positive result also holds the ability to alter source records, and regulators have to take the chain of custody on trust. Committing each reading and consent signature onchain at the moment of capture keeps the record verifiable by monitors and regulators without depending on the sponsor's cooperation.
