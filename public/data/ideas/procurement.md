---
title: "Procurement"
domains: business-operations
desires:
  - manufacturer/procurement-that-reconciles-itself
---

## Problem

Purchase orders, vendor agreements, and replenishment workflows run through email chains and disconnected ERP modules, with each party keeping its own copy of every transaction. Disputes over terms that were never machine-readable cause delays and duplicate orders. At month-end the same economic event lives as two separate records that have to be manually reconciled, consuming a large share of close-cycle time, and audit preparation depends on weeks of counterparty-confirmation letters.

## Solution

Purchase orders, vendor agreements, and replenishment schedules recorded as onchain contracts that both buyer and vendor confirm at the point of origination. The same entry serves both sides' books, so neither can later claim a different version of the terms, routine reorders fire against agreed triggers without manual sign-off, and the month-end reconciliation step disappears because the record was joint from the start rather than two copies to square. Disputes over what was actually ordered fall away, because the order was machine-readable and signed by both parties when it was placed.

A workable starting point is one buyer and a couple of high-volume suppliers moving their recurring POs onto a shared record, with each side's existing ERP writing to and reading from it, leaving price negotiation and one-off purchases where they are today. Multi-tier supply chains and fully automated replenishment can layer on once the two-party record is trusted.

## Why Ethereum

When procurement and intercompany accounting run through one company's ERP, the terms and the transactions are only as reliable as that party's records, and either side can later claim a different version. Putting the agreement and the transaction record onchain gives both parties the same machine-readable history that neither can revise alone, so the workflow and the audit trail do not depend on trusting one counterparty's system.
