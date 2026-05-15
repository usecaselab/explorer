---
title: "Credit scoring from off-chain financial history"
domains: finance
---

## Problem

Hundreds of millions of people are creditworthy — they pay rent on time, maintain savings, and run profitable small businesses — but are invisible to formal lenders because their financial history lives in bank apps, rental platforms, and payroll systems that lenders can't access without the borrower surrendering raw account credentials.

## Solution

zkTLS-based credit assessments where borrowers prove specific financial claims — 12 months of on-time rent payments, a salary above a threshold, a business revenue history — directly from source platforms without sharing login credentials, giving lenders verifiable underwriting data for borrowers who lack formal credit files.

## Why Ethereum

A data aggregator standing between borrowers and lenders collects raw account credentials and financial history into one store that becomes a surveillance point and a breach target. Building this with zero-knowledge proofs onchain lets a borrower prove a specific claim, like a year of on-time rent, without handing over the underlying account, and keeps the check from being logged by a company in the middle.
