---
title: "Dynamic expense approvals"
domains: business-operations
---

## Problem

Expense approval runs on static workflows in an ERP or expense tool: fixed dollar thresholds and fixed approver chains. The rule cannot tell whether a department is already over budget, whether the company's cash position has tightened, who is asking, or what the money is for. Companies end up either routing everything through finance, which is slow, or setting limits loose enough to be risky.

## Solution

Expense approvals where the rule is evaluated for each request against live inputs rather than read from a fixed table. The approval can depend on the requester's role and seniority, the department's remaining budget, the company's current cash position, the vendor and spend category, and oracle-fed external conditions. A recurring renewal under budget clears on its own, a new vendor or a purchase that pushes a team over its quarter is routed for review, and spending can tighten automatically when runway falls below a set level.

## Why Ethereum

An approval rule that reads the company's finances and outside conditions only works if those inputs cannot be quietly edited by whoever wants the payment to clear. Running the rule in the account itself, against onchain balances and oracle feeds, makes both the policy and the inputs it judges against inspectable, so a dynamic approval is something the organization can audit rather than a black box inside an expense tool.
