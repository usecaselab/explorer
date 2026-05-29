---
title: "Age and eligibility proofs without identity disclosure"
domains: identity
desires:
  - shopper/prove-without-revealing
---

## Problem

A teenager trying to prove they're 18 to access a website, or a doctor proving they hold a medical license to prescribe remotely, must hand over their full government ID — exposing date of birth, address, and ID number to a third party who only needed a yes/no answer — creating surveillance infrastructure and breach risk for a simple eligibility check.

## Solution

Zero-knowledge proofs that let individuals demonstrate they meet a threshold — over 18, licensed physician, accredited investor — without revealing the underlying document, name, or any other personal attribute beyond the specific claim being verified.

## Why Ethereum

A centralized verification service would see every site a person unlocks and would hold everyone's identity documents in one place that becomes a target for breaches. Building this with zero-knowledge proofs onchain lets a person prove a specific claim without revealing the underlying document, and keeps the check from being routed through a company that can log or leak it.
