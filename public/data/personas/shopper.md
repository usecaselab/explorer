---
id: shopper
name: Shopper
portraits:
  - name: Eleni
    role: Grocery shopper
    location: Athens
    icon: shopping-bag
  - name: Devon
    role: EV driver
    location: Toronto
    icon: car
  - name: Lakshmi
    role: Apartment renter
    location: Mumbai
    icon: house
desires:
  - id: verify-what-im-buying
    title: "I want to know if the \"free-range\" carton actually came from a farm that lets the hens outside"
    framing: |
      I pay double for ethical labels and have no way to tell whether the certifier ever visited the farm or whether the carton was relabeled in the warehouse. If each handoff from coop to shelf was signed onchain I could scan the carton and see the actual farm and the last inspection date.
  - id: prove-without-revealing
    title: "I want to prove I'm over 18 to a website without uploading my passport to it"
    framing: |
      Every age-gated site and every account signup wants a photo of my ID sitting on some vendor's server waiting to leak. A zero-knowledge proof tied to a credential my government already issued would let the site see "yes, over 18" and nothing else.
  - id: peer-to-peer-commerce
    title: "I want to sell my old bike to a stranger without giving eBay 13 percent for holding the money"
    framing: |
      The only reason I use a marketplace for a one-off sale is that neither side trusts the other to ship or pay first, and the platform charges a double-digit cut for that single service. Onchain escrow that releases when the buyer confirms delivery, plus a reputation I can carry between sites, would do the same job for cents.
  - id: send-receive-money-cheaply
    title: "I want to plug my EV into any charger and have it just bill me, without signing up for that network"
    framing: |
      Every charging network wants its own app, account, and minimum top-up, because card fees make a single $4 session uneconomic to bill directly. Onchain micropayments that settle in fractions of a cent would let the car pay the charger per kilowatt-hour with no account in the middle.
  - id: enforceable-contracts
    title: "I want my rental deposit back automatically when I move out clean, not whenever the landlord feels like it"
    framing: |
      My landlord holds two months of rent in an account I cannot see and decides on his own timeline whether to return it, and the small-claims path costs more than the deposit. If the deposit sat in onchain escrow that released on a signed move-out inspection, the discretion goes away.
---

# Shopper
