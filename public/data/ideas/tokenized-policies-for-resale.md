---
title: "Tokenized policies for resale"
domains: insurance
desires:
  - investor/portable-portfolio
  - shopper/enforceable-contracts
---

## Problem

A policyholder whose circumstances change, who sells the car, pays off the mortgage, or no longer needs a given level of life cover, is usually stuck with the policy. Most contracts can only be surrendered back to the carrier for a fraction of their value rather than sold to someone who would actually use the coverage. The carrier writes the policy as non-transferable and runs whatever buyback exists, so capital a policyholder paid into a long-dated policy stays locked, while a buyer who would gladly take over an in-force policy has no way to reach the seller.

## Solution

Issue policies as transferable onchain contracts, so a policyholder can sell, swap, or restructure coverage on a secondary market instead of surrendering it to the carrier at a loss. The contract carries its own terms, premium schedule, and transfer rules, so a buyer can verify exactly what they are taking on before committing, and the assignment settles without the carrier acting as gatekeeper.

A narrow place to start is a single long-dated line where surrender value is poor and demand to assume policies is real, such as whole life or annuities. The first version needs only standardized policy terms onchain, a verifiable record of premiums paid, and a transfer function the carrier recognizes as a valid assignment, leaving underwriting and claims exactly where they are today.

## Why Ethereum

An insurer that keeps policies non-transferable benefits directly from the trapped capital, and a resale market it operates lets it decide who may sell and at what terms. Representing policies onchain moves the contract and its transfer rights out of the issuer's exclusive control, so a policyholder can sell or restructure coverage without the carrier's permission.
