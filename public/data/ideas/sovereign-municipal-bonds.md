---
title: "Sovereign & municipal bonds"
domains: government, finance
desires:
  - investor/access-gated-markets
---

## Problem

Issuing and settling government debt runs through layers of intermediaries: underwriters, clearing houses, custodians, and paying agents, each taking a fee and adding time. Settlement takes two business days or longer, and high minimum denominations, often tens of thousands of dollars, shut retail investors out of buying the bonds their own city or country issues. The same intermediaries that custody the debt decide which investors get access and at what spread, so a citizen who wants to lend directly to a local infrastructure project usually cannot, while the desk that intermediates the trade captures the margin.

## Solution

Government bonds issued, settled, and serviced onchain, with the instrument carrying its own coupon schedule and the transfer and payment logic running on public rules. Settlement happens in the same transaction as payment rather than two days later, denominations can drop low enough for a resident to buy a small piece at the same price the institutional desk pays, and coupon payments are visible and automatic rather than routed through a paying agent.

A workable starting point is a single municipal revenue bond tied to a specific local project, sold in small denominations to residents alongside the conventional issuance, with coupons paid onchain from the project's receipts. Sovereign-scale issuance and secondary-market depth can follow once a few municipal issues have settled and serviced cleanly.

## Why Ethereum

The intermediaries that clear and custody government debt set the minimum sizes, the settlement timelines, and the fees, and they decide which investors get access at all. Issuing bonds onchain lets coupons and settlement run on public rules, so smaller investors can hold debt directly and the terms are not gated by the firms that profit from the layers in between.
