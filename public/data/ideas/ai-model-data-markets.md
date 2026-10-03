---
title: "AI model and training data markets"
domains: ai
desires:
  - creator/ai-trained-on-my-work
  - researcher/ai-trained-on-my-work
---

## Problem

AI models and training datasets are passed through ad-hoc channels with no enforceable licensing, usage metering, or royalty distribution, so creators lose control the moment they publish. The problem runs deeper for the creative workers whose output trained these models. Writers, artists, and photographers have no mechanism to verify whether their work was included in a training corpus, no ability to opt out, and no way to claim revenue from models that directly replicate their style.

## Solution

AI models and training datasets registered as onchain assets with programmable licensing terms set at registration: who may use them, under what conditions, and how revenue splits among rights holders. Usage is metered against the asset itself, royalties flow automatically to everyone with a claim, and a cryptographic provenance record lets a creator check whether their work sits inside a given corpus rather than waiting for an AI company to disclose it voluntarily.

The smallest viable version is a single curated dataset, such as a licensed image or text collection, registered onchain with a fixed license and a revenue split to its contributors, sold to model trainers who get a clean provenance trail in return. Retroactive opt-out, automated style-replication claims, and cross-corpus auditing can follow once registration and payout work for one collection.

## Why Ethereum

If a marketplace ran on one company's platform, that operator would report usage on its own systems and decide what creators are owed, leaving the same disclosure gap that lets AI companies stay quiet about what they trained on. Putting licensing and provenance onchain keeps the usage record outside any operator's control, so creators can verify whether their work was used and claim compensation without depending on a platform to be honest.
