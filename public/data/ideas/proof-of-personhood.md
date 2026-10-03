---
title: "Proof of personhood and sybil resistance"
domains:
  - identity
  - civil-society
desires:
  - shopper/prove-without-revealing
---

## Problem

Online systems increasingly need to know that an account belongs to a distinct human, not one of a thousand bots a single operator spun up. A governance vote, a public-goods airdrop, a one-person-one-share distribution, a rate-limited service, or a comment section all degrade the moment one actor can cheaply mint unlimited identities. Cheap generative AI has made fake accounts indistinguishable from real ones at scale, so the old defenses (CAPTCHAs, phone numbers, manual review) no longer hold. The reflexive fix, tying every account to a government ID, hands a central party a complete map of who participates where and excludes anyone the state will not document.

## Solution

A way for a person to prove they are a unique human, once, without that proof revealing who they are or being controlled by a single issuer. Independent issuers (governments, but also community vouching, biometric checks a user opts into, and existing trusted credentials) attest to uniqueness, and the person derives a per-application pseudonym that is sybil-resistant inside that app but unlinkable across apps. A relying party learns "this is one distinct human, not seen here before" and nothing else. A workable starting point is sybil resistance for a single high-value, lower-stakes use such as a public-goods airdrop or a community vote, where one issuer is good enough and the cost of a fake account is real. Multiple competing issuers can be added later, which is what keeps any one of them from becoming the gatekeeper.

## Why Ethereum

Whoever runs the personhood registry decides who counts as a person and can see, or sell, the full graph of where each person shows up, which is exactly the power that makes a single-operator solution dangerous. An open protocol where several independent issuers can each attest uniqueness, verified on a neutral chain, means no one company is the global gatekeeper of human identity and no one can quietly revoke a person's standing. Credible neutrality is the property the use case actually needs: a sybil-resistance layer that a platform, a government, or a foundation can unilaterally control is one the rest of the world cannot safely build on.
