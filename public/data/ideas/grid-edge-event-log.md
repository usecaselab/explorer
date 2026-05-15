---
title: "Event log for grid edge devices"
domains: utilities
---

## Problem

Distribution utilities are adding thousands of distributed energy resources, smart inverters, and storage systems at the edge of the grid, but they have no reliable record of what those devices did. The monitoring systems built for large centralized power plants do not reach the grid edge, and as the number of connected devices grows, so does the need for a trustworthy log of every command and state change for security investigations and regulatory oversight.

## Solution

An append-only event log for grid edge devices that records commands, state changes, and energy-flow measurements with cryptographic attestation as they happen. It gives distribution operators and regulators a complete audit trail for the part of the grid where current monitoring stops, and a record an attacker cannot quietly edit to cover their tracks.

## Why Ethereum

If the event log lives on a system the utility or a vendor controls, the same party responsible for grid edge devices also controls the record of what those devices did, and an attacker who reaches that system can erase their own tracks. Recording the log onchain keeps device commands and state changes where regulators and forensics can verify them against a history no single operator can rewrite.
