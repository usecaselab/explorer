---
title: "Patient-controlled health records"
domains: health, identity
desires:
  - patient/own-my-records
---

## Problem

Medical records are siloed across hospitals, clinics, and insurers, leaving patients unable to access, control, or share their own health data when switching providers or seeking a second opinion. The gap is acute for mental health. A patient switching therapists often has to reconstruct an entire psychiatric history from memory, including which medications worked, which dosages caused side effects, and previous diagnoses, because clinician notes follow no standard format and there is no patient-controlled way to move them. The institution that holds the chart has little incentive to make leaving easy, so the friction that keeps a patient from switching is a feature of the system rather than an accident.

## Solution

A record format the patient holds and carries between providers, where the patient grants time-bounded, granular access rather than asking each institution to release a copy. A new clinician receives exactly the fields the patient chooses to share, can verify that a test result or diagnosis was attested by the issuing lab or doctor and has not been altered, and loses access automatically when the patient revokes it. The sensitive data itself stays encrypted and off the public chain; only the access grants and the integrity attestations are recorded onchain.

The smallest viable version is a single high-friction handoff: let a patient carry a verifiable medication and allergy list, plus signed lab results, from one provider to the next. Full longitudinal records, imaging, and insurer integration can be layered on once the consent-and-verify pattern is in real use.

## Why Ethereum

When records sit in hospital and insurer systems, the institution decides what a patient can access and when, and a central store of medical histories becomes a target for breaches and surveillance. Building patient-controlled records onchain keeps consent and access with the patient, lets any provider verify a record was not altered, and avoids routing sensitive history through a company that can log it.
