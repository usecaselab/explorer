---
title: "Clinical trial pre-registration and results registry"
domains: science, health
desires:
  - patient/trust-the-evidence
  - researcher/data-integrity
---

## Problem

Sponsors register a clinical trial and its planned endpoints, run it, then publish selectively, foregrounding the outcomes that flatter the drug and quietly dropping the ones that do not. This is outcome reporting bias, and it is well documented: registries like ClinicalTrials.gov exist precisely because of it, yet a large share of trials still go unreported or report different endpoints than were registered. The effect distorts the evidence base doctors prescribe from, so a treatment that looks effective in print may have failed on the outcomes that mattered. Existing registries help, but they are run by bodies that can let sponsors amend a protocol after results are in, and a reader often cannot tell what the original plan was.

## Solution

A registry where a trial's protocol and primary endpoints are cryptographically committed before the first patient is enrolled, so the original plan is fixed and time-stamped. When results are published, anyone can check them against what was committed and see whether endpoints were switched, outcomes dropped, or the analysis quietly changed. Because the commitment is made up front and cannot be revised, "we always meant to measure this" stops being available as a defense.

A workable starting point is a thin commitment layer beside an existing registry: investigators hash their protocol and endpoint definitions at registration, and journals or funders require that hash in the published paper. It does not replace ClinicalTrials.gov; it makes the pre-registration tamper-evident. Automated comparison of results to protocol, and broader study types, can follow.

## Why Ethereum

A registry run by an industry body or a single institution can let sponsors amend protocols or delay results, because the same parties that benefit from burying outcomes influence the registrar. Committing protocols onchain fixes the original record where no sponsor or operator can revise it, so a doctor, a patient, or an independent reviewer can check published results against what was promised without trusting the registrar to have preserved it faithfully.
