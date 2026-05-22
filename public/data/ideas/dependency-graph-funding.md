---
title: "Dependency-graph funding"
domains: business-operations, civil-society
---

## Problem

A maintainer whose library is depended on by thousands of downstream projects sees none of the economic value those projects generate. When a downstream company sponsors a project, the money stops at the top-level library and rarely reaches the upstream dependencies that project quietly relies on. The deepest layers of the stack, the cryptography libraries and parsers and build tools, are also the most under-resourced, because gratitude does not propagate down the import graph the way usage does.

## Solution

Funding contracts that fan an incoming sponsorship or revenue share across the dependency tree, weighted by usage proofs derived from package manifests and build artifacts. A downstream project receiving a grant or commercial revenue routes a configurable portion through the contract, which splits it among direct and transitive dependencies according to a rule the project's maintainers publish. Support reaches the layers it should without each upstream maintainer having to chase it manually.

## Why Ethereum

Routing money through a dependency graph requires every participant to agree on the same set of weights and the same set of recipient addresses, and to be confident that the routing logic cannot be quietly altered between deposit and payout. Settling the splits onchain, against a usage graph anyone can audit, lets a downstream maintainer commit to funding upstream work in a way her sponsors and her dependencies can both verify, without putting a foundation in the middle to mediate the relationship.
