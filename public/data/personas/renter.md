---
id: renter
name: Renter
portraits:
  - name: Lakshmi
    role: Apartment renter
    location: Mumbai
    icon: house
  - name: Darnell
    role: Month-to-month tenant
    location: Chicago
    icon: building-2
  - name: Mei
    role: Student renter
    location: Taipei
    icon: key
desires:
  - id: rental-deposit-escrow
    title: "I want my deposit back automatically when I move out clean, not whenever the landlord feels like it"
    framing: |
      My landlord holds two months of rent in an account I cannot see and decides on his own timeline whether to return it, and the small-claims path costs more than the deposit. If the deposit sat in onchain escrow that released on a signed move-out inspection, the discretion would go away.
  - id: portable-rental-history
    title: "I want my rental history and references to travel with me to the next place"
    framing: |
      Every application asks me to prove I pay on time and leave places clean, but that record lives in the heads of past landlords and the files of agencies I cannot access, so I start from zero each move while tenants with connections get the unit. Payment history and landlord references attested onchain and held by me let a new landlord verify a real track record without my chasing down old ones for a letter.
  - id: prove-income-without-oversharing
    title: "I want to prove I can afford the rent without handing a landlord my whole financial life"
    framing: |
      To rent a flat I am asked for bank statements, pay slips, and sometimes full account access, all of it sitting in a landlord's inbox waiting to leak, just to show I clear an income threshold. A zero-knowledge proof that my income exceeds the rent by the multiple they require lets them see that I qualify and nothing else.
  - id: repairs-the-landlord-cant-ignore
    title: "I want unmade repairs to draw on the rent, without my being the one who breaks the lease"
    framing: |
      When the heat or the plumbing fails, a tenant's only leverage is to withhold rent and risk eviction, or wait months for a housing complaint to be heard. Rent routed through an escrow that diverts to a repair fund when a documented, unaddressed habitability issue passes a deadline gives a tenant real leverage without unilaterally breaching the lease.
---

# Renter
