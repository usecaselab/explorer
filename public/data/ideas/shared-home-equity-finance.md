---
title: "Shared home-equity finance"
domains: real-estate-and-housing, finance
desires:
  - investor/access-gated-markets
---

## Problem

A homeowner who is equity-rich but cash-poor has few good ways to tap that equity without taking on a monthly payment. Home-equity loans and cash-out refinances add debt and interest at exactly the moment rates are high, so a small industry of shared-equity finance firms offers cash today in exchange for a slice of the home's future value, settled when the owner sells or refinances. The catch is that the firm writes the contract, orders the entry and exit appraisals that decide how much it is owed, and is the only counterparty: the homeowner cannot shop the obligation to cheaper capital or sell it on, and the payoff formula is buried in terms most people sign without modeling. When the house appreciates, the homeowner often discovers the firm's share is far larger than the cash they received.

## Solution

Structure the equity advance as an onchain contract whose payoff formula is explicit code, so the homeowner can see how the obligation grows with the home's value before signing, and settlement follows that formula rather than an appraisal the counterparty controls. A home is not a liquid asset with a public price, so the formula must read from something observable: the real sale price at exit, or a regional house-price index or automated valuation model in the interim. That swaps the discretionary appraisal one firm controls today for basis risk, the gap between any index and the specific house's value.

The smallest viable version is a standardized, capped-share agreement on a single home, settling on the real sale price, or a named index otherwise, with title and the lien left as they work today. A secondary market and competitive refinancing can build on that once the formula is trusted.

## Why Ethereum

Shared-equity firms hold all the leverage today because they author the contract, control the appraisals that set the payoff, and are the sole counterparty a locked-in homeowner can deal with. Putting the payoff formula and the price reference onchain makes the obligation something the homeowner can verify and model rather than trust, and making the investor's stake transferable lets other capital compete to fund or buy it, which a single-firm product structurally prevents. The neutral rail matters precisely because the conflict of interest sits with the party that would otherwise own the math.
