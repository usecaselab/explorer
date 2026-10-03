---
title: "Publishing that survives takedown pressure"
domains: media, civil-society
desires:
  - journalist/publish-through-pressure
---

## Problem

A litigant or an official who cannot win against a story in court can often get it pulled without one. Rather than sue the reporter, they lean on the weakest link in the distribution stack: the hosting provider that fears liability, the domain registrar that can suspend a name, or the app store that can pull the outlet's app on a vague policy ground. Each of those intermediaries would rather drop one piece than fight on a contributor's behalf, so a single complaint letter can make reporting disappear from where readers actually look for it. Smaller outlets and freelancers feel this most, because they lack the legal budget that makes a host willing to hold the line.

## Solution

Publish the story to distribution rails that no single company can be ordered to clear. The article lives at a content-addressed location that many independent nodes can serve at once, and its human-readable name resolves through a registry the author controls rather than a registrar that can suspend it, with the authoritative address signed by the author so any mirror knows what to serve. Because the same piece is reachable from many hosts simultaneously, leaning on any one host, registrar, or app store removes nothing. A workable starting point is a publish-once tool a newsroom runs after its normal CMS export: it pins the finished article across independent hosts, registers a name the author holds, and publishes the signed address, so the existing site stays primary while a pressure-resistant copy stands behind it.

## Why Ethereum

Takedown by pressure works because every link in the conventional publishing chain, the host, the registrar, the app store, has an owner who can be named, served, and made to comply this afternoon. The point of resolving names and addresses through rails the author holds rather than a registrar leases is that there is no longer one operator an official can lean on to make a live story unreachable. As long as readers and mirrors keep serving the piece, the complaint letter has nowhere to go. The adversary's entire strategy is to find the single intermediary willing to fold under live pressure, and this removes the existence of that intermediary.
