---
title: "Subscriptions the buyer can cancel unilaterally"
domains: commerce
desires:
  - shopper/enforceable-contracts
---

## Problem

Cancelling a subscription is deliberately harder than starting one. A streaming service, a gym, or a SaaS tool takes a card authorization at signup and then controls whether and when the charging stops, so cancellation routes through retention flows, support queues, or a phone line open four hours a day. The merchant and its payment processor hold the standing permission to pull money, and the customer's only real lever is to call the bank and dispute charges after the fact. Consumer agencies field millions of complaints a year about charges that continued after the customer believed they had cancelled, which is why regulators keep proposing click-to-cancel rules to force the issue.

## Solution

Recurring payments run from a spending allowance the buyer holds in their own wallet rather than a pull authorization the merchant holds on a card. The customer grants a capped, time-bounded permission, the merchant draws each period's fee within it, and the customer can revoke that permission at any moment in one action the merchant cannot override or slow down. The active mandates, their limits, and their history are visible to the payer, so there is no hidden authorization quietly renewing in the background.

The smallest viable version is a single merchant offering stablecoin billing against a revocable wallet allowance for one subscription tier, where cancelling means revoking the permission rather than asking the merchant to stop. Proration, free trials, and usage-based billing can layer on top once the revocable mandate is the default.

## Why Ethereum

When the merchant or its processor holds the authorization to charge, cancellation is something the customer has to request from the party that loses money by granting it, which is exactly why the cancel path is engineered to be slow. Moving the payment permission into the buyer's self-custodied wallet inverts that control: the standing authorization lives with the payer and is revoked unilaterally, so the merchant can only collect while the customer keeps the mandate open. A neutral payment rail no merchant operates is what makes the cancel button belong to the buyer rather than the seller.
