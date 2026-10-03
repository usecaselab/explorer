---
title: "Group buying with escrowed thresholds"
domains: commerce
desires:
  - community-organizer/coordinate-collective-action
---

## Problem

A neighborhood association that could get a bulk discount on solar panels, a cluster of small shops that could negotiate wholesale pricing if they ordered together, or fifty households that want the same appliance at a volume price all run into the same wall: the discount only exists if enough people commit, but nobody wants to put money down before knowing the others will. Today this is coordinated by one person collecting cash or pledges in a spreadsheet, which means everyone has to trust that organizer to hold the funds, count honestly, refund fairly if the group falls short, and not disappear with the pot. Most potential group buys never reach the threshold because the coordination cost and the trust risk outweigh the saving.

## Solution

A group-buying contract where each buyer commits funds into escrow against a published target: a minimum number of participants or a minimum total order that unlocks the bulk price. If the threshold is reached the pooled payment releases to the supplier and every participant gets the volume price; if it is not reached by the deadline, everyone is refunded automatically. The count, the threshold, the deadline, and the escrowed balance are visible to every participant, so no organizer sits between buyers and their money.

The smallest viable version is a single one-off purchase among a group that already coordinates, a co-op, a building, or a trade association, with a fixed unit price, a participant threshold, and a hard deadline. Negotiated tiered pricing, recurring buys, and supplier discovery can come later.

## Why Ethereum

A purchasing group an intermediary would find too small or too political to serve, fifty neighbors, a handful of shops, a tenants' union, can stand itself up onchain without asking a platform's permission and hold its own pot rather than handing it to an organizer or a company in the middle. That permissionless self-organization and self-custody is the part no centralized service offers: anyone can open a pool, and the funds sit under rules every participant reads instead of in one party's account. The threshold-and-refund logic matters too, releasing to the supplier only if the target is met and refunding automatically if not, but on a permissioned platform that mechanism is just Kickstarter. The Ethereum-shaped difference is that the group needs no host to exist or to be trusted with the money.
