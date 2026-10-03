---
title: "Source protection for journalists"
domains: media, civil-society
desires:
  - journalist/censorship-resistant-comms
---

## Problem

A government or corporate whistleblower who wants to leak to a journalist faces a bind. Submitting documents anonymously makes the story hard to verify and easy for the target to dismiss as fabricated, while the proof of insider status that would make it credible, the job title, the department, the access level, is exactly what makes the source identifiable and exposes them to prosecution. Existing secure-drop systems run on servers someone owns and can be ordered to hand over logs, and any file received carries metadata that can burn the sender. The source has to choose between being believed and being safe, and the tools available force the trade.

## Solution

A submission system where a source proves their organizational affiliation, that they work at a named agency or hold a given clearance level, using a zero-knowledge proof that reveals nothing else about who they are. The proof produces a cryptographic attestation the journalist can publish alongside the story, so readers and editors can confirm the documents came from a genuine insider without any record existing that links the attestation back to a person.

A workable starting point is one credential type for one class of source, for example proving current employment at a specific public agency against a set of signed staff credentials, with the proof verified onchain and no operator holding the underlying identity. Document transport and metadata scrubbing can be layered on once the affiliation proof is trusted by a newsroom.

## Why Ethereum

A verification service run by a company would hold records linking sources to the credentials they proved, a single place that can be subpoenaed, breached, or pressured to expose a whistleblower. Building this with zero-knowledge proofs onchain lets a source prove their role without that link existing anywhere, so a journalist can publish credible proof and nothing about the source's identity is stored for anyone to compel.
