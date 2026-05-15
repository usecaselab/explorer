---
title: "Pay-per-use micropayments"
domains: commerce
---

## Problem

Today's payment rails have an economic floor. Cards cannot profitably process anything below roughly $0.50 because the fixed per-transaction cost eats the margin, which blocks entire pricing models that would otherwise make sense: paying a few cents to read one article, paying per API call instead of buying into a subscription tier, paying per second of video streamed, paying a small tip to a creator. Sellers default to subscriptions, ad-supported content, or steep paywalls because the alternative would cost more to process than it collects.

## Solution

Stablecoin payments down to fractions of a cent settle directly between payer and seller, with no per-transaction fixed cost large enough to break the model. Pricing can match the unit of value (one article, one API call, one minute of stream, one model query), and a wallet can authorize small recurring or per-action payments without a card-network preauthorization flow in the middle.

## Why Ethereum

The fee floor on card payments exists because every transaction is intermediated by networks, processors, and banks that each take a fixed-cost slice. Settling small payments onchain removes that stack, so the unit of pricing can be the unit of value rather than what the rails can profitably process.
