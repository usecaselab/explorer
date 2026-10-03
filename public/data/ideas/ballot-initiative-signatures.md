---
title: "Ballot initiative and petition signatures"
domains: government, civil-society
desires:
  - civic-participant/verify-public-decisions
---

## Problem

Direct-democracy tools like ballot initiatives, recall petitions, and citizen referendums depend on collecting a threshold number of valid signatures, and that collection still runs on paper sheets validated behind closed doors. Election officials check signatures against voter rolls and reject the ones they judge invalid, often disqualifying a large share with little explanation and no practical appeal before the deadline passes. The body doing the validation is frequently part of the same government the petition is meant to challenge, whether the measure recalls an official, overturns a local ordinance, or forces a question onto the ballot. Organizers who clear the bar on paper can still watch a campaign die in a validation process they cannot observe or contest.

## Solution

A signature drive where each supporter signs an initiative with a credential tied to their voter eligibility, and the running count is recorded onchain so anyone can verify the threshold was genuinely met. Zero-knowledge proofs let a signature prove the signer is a registered, eligible voter who has not signed twice, without exposing who they are or which measures they backed, so the tally is auditable while the individual political act stays private. An official can still flag a specific signature, but the rejection is logged against a record the public can check rather than absorbed into an opaque count.

A workable starting point is a single local initiative run in parallel with the legal paper process, using existing government-issued identity credentials to anchor eligibility. Statewide drives and binding legal recognition follow once the verifiable count has been demonstrated against a hand validation.

## Why Ethereum

The authority that validates petition signatures is often the same government whose decision the petition contests, which gives it both the means and the motive to disqualify enough signatures to keep a measure off the ballot. Running the count on neutral rails the petitioning government does not operate lets any citizen verify the threshold was met, while zero-knowledge proofs keep each signer's identity and political stance private so participation cannot be retaliated against. A centralized version fails precisely because the party with the conflict of interest controls the tally; the mechanism only works if no single official can quietly discard the signatures they find inconvenient.
