---
title: "Wearables and health data exchanges"
domains: health, ai
desires:
  - patient/own-my-records
---

## Problem

Wearables generate continuous biometric data, including glucose readings, sleep stages, and heart-rate variability, that would be valuable to medical researchers, insurers, and the individuals wearing the device. Today that data is locked inside the device maker's platform, which sets the terms of any export and is usually the party that strikes data deals and keeps the proceeds. Someone who wants to contribute their readings to a specific study, or sell access to an insurer in exchange for a better rate, has no standard way to grant that access or to prove the data is genuine and unaltered. The person generating the data carries the breach risk while the platform captures the value.

## Solution

A standard for wearable biometric data, such as continuous glucose readings, sleep stages, or heart-rate variability, where the individual holds custody and grants time-bounded access to specific buyers. Each reading is signed at the device, so a researcher or insurer can trust it has not been altered after capture. Payment for access settles to the individual rather than to the wearable platform, and access ends automatically when the agreed window or condition closes.

The smallest viable version is one data type and one buyer class: let people grant a research study time-bounded access to device-signed glucose or heart-rate data for a set fee, with the consent grant and the payment recorded onchain. Insurer underwriting and a broader data marketplace can build on the same custody and signing model.

## Why Ethereum

When biometric data sits inside a wearable company's platform, that company decides who buys it and keeps the value while the individual carries the breach risk. Giving people custody of their own health data onchain lets them direct it to a researcher or insurer on their own terms and capture what it is worth.
