---
title: "Carbon and biodiversity credit markets"
domains: environment, finance
desires:
  - investor/verify-what-im-buying
---

## Problem

A company buying offsets to meet a net-zero pledge picks credits from a registry catalog where a ton from a rigorously monitored reforestation project sits at roughly the same price as a ton from a project that would have happened anyway or has since burned down. The registries that set the rules, such as Verra and Gold Standard, both certify the methodologies and earn fees from the issuers they certify. Investigations into rainforest credits have repeatedly found that large shares represented little or no real reduction, yet buyers had no way to tell the good from the worthless before paying. Forests, watersheds, and habitat that genuinely store carbon and host species also have no liquid way to be represented and priced, so the ecological assets that work best earn no premium over the ones that do not.

## Solution

Represent each environmental credit as an onchain asset carrying its full provenance: the project it came from, the methodology and version used, the verifier who signed off, the vintage, and a link to the monitoring data behind it. Buyers, raters, and the public can then price a credit on its actual attributes instead of treating every ton as fungible, and each retirement is recorded once so the same credit cannot be claimed twice across registries. Distinct asset classes for forests, watersheds, and biodiversity let markets reward the projects that hold up.

A workable starting point is one credit type from one methodology, say improved forest management, issued onchain with its monitoring feed attached and retired through a single public contract. Cross-registry reconciliation and richer ecological asset classes can follow once the provenance format proves out.

## Why Ethereum

Credit quality today depends on rating agencies and registries whose judgments are opaque and whose business depends on the issuers they assess, so buyers cannot independently tell a rigorous credit from a weak one. Attaching provenance and methodology to each credit onchain lets buyers check quality themselves and makes double-counting visible to anyone, not just the registry.
