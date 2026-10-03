---
title: "Decision markets for corporate governance"
domains: business-operations
desires:
  - founder/pay-for-outcomes
---

## Problem

Corporate decisions, which strategy to pursue, whether to hire or fire an executive, which product line to back, get made through some mix of politics, hierarchy, and intuition rather than any mechanism that aggregates what the people closest to the work actually believe. Board votes and management sign-off concentrate the call in the hands of whoever has seniority and confidence, with no feedback loop that rewards being right or penalizes being wrong. The result is that organizations often act on what is good for the people in power rather than what is good for the organization, and the dissenting analyst who turns out correct gets no say and no credit.

## Solution

Conditional prediction markets tied to a company metric the board already cares about, such as share price, revenue, retention, or treasury value. Any proposal spins up two parallel markets, one priced on the metric if the proposal passes and one if it is rejected, and the proposal executes only when the markets predict it improves the metric. Participants who hold genuine information have a direct financial reason to trade it in rather than stay quiet, and the signal comes from money at risk instead of from rank.

A workable starting point is a single recurring, measurable decision inside one organization, such as grant or treasury allocation, where outcomes are quantifiable and frequent enough for a market to learn. Early implementations point the way: Butter ran markets in Optimism's grant-allocation experiments, and MetaDAO has processed dozens of governance proposals for multiple organizations on this mechanism.

## Why Ethereum

If the decision market runs on infrastructure that management controls, the people whose power the mechanism is meant to check can pause it, adjust how trades settle, or ignore a signal they dislike, which returns the decision to politics and seniority. Building it onchain keeps the market's rules and the link between its signal and the outcome verifiable by every participant, outside any single executive's reach.
