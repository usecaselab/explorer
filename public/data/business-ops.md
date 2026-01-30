# Business Ops

# **Problem**

Small and medium enterprises face heavy overhead in managing core operations—cap tables, payroll, contracts, treasury, procurement, and accounting. Each function relies on siloed Web2 tools (Carta, QuickBooks, Gusto, Deel, Stripe, Stripe Atlas, Mercury, Brex) that don’t interoperate, require constant reconciliation, and are vulnerable to errors, fraud, or delay. Cross-border operations add friction in payments, compliance, and document workflows. As a result, early-stage companies spend scarce time and money on back-office administration instead of growth.

At the same time, advances in AI create the potential for organizations that could be run and optimized by machine intelligence—but today’s firms are not software-defined systems. Their fragmented, bureaucratic infrastructure prevents AI from fully accessing or coordinating the organization as a computable whole.

# **Opportunities**

> Make it more efficient to start and run a company
> 

Tokenized firm stack - beyond stablecoins (cash) and RWAs (assets) → tokenizing the operating system of the firm itself. The goal is to provide a unified, efficient, and transparent foundation for startups, small businesses, and eventually large enterprises. This is achieved by bringing the core business functions onchain.

- Cap Tables & Equity: verifiable, onchain ownership records from day one (issuance, vesting, transfers).
- Roles & Permissions: programmable, wallet-based authority systems enforcing who can move funds or sign agreements; onchain identifiers to represent employees/members
- Treasury Management: stablecoin-based treasury with yield strategies, automated reporting, and compliance hooks.
- Payroll & Invoicing: instant, programmable global payouts with automated tax/KYC reporting.
- Revenue & Profit Splits: automated distributions to partners, employees, and investors tied to income events; tokenized revenue/profits; tokenize receivables/payables
- Commercial Agreements: legal smart contracts embedding milestones, royalties, licensing, rebates, volume discounts, performance incentives, warranties, expiries, dispute handling directly into execution logic.
- Bookkeeping & Accounting: real-time, tamper-evident “triple-entry” ledgers providing auditable financial history.
- Procurement: smart contracts for purchase orders, RFQs, RFPs, vendor agreements, automatic replenishment plans
- AI CEOs: once the firm’s core systems are tokenized and software-defined, AI can act as an organizational brain—analyzing complete data flows, simulating strategies, and executing decisions onchain.

# Resources

**Projects**

- General
    - [Mezzanine](https://www.mezzanine.xyz/) ([docs](https://help.mezzanine.xyz/en/)) - A modular, self-custody finance OS for companies. Provides payments, payroll, equity, accounting, and permissions in one programmable platform. Uses public keys and smart contracts for role-based access, replacing legacy IAM systems (Okta, Rippling, Google Admin) with onchain enforcement
    - [Splits Teams](https://splits.org/teams/) - Programmatic profit/revenue sharing and automated team payouts
    - [Stackup](https://www.stackup.fi/) ([explainer](https://x.com/nichanank/status/1965824727186030742)) - Bank ↔ wallet bridge with batch payments, stablecoin yield, audit trails, and real-time cashflow controls
    - [Wink](https://www.getwink.io/) - Lightweight business ops for individual freelancers
    - [Symfoni](https://medium.com/blockchangers/how-norway-is-using-ethereum-arbitrum-for-shareholder-management-500e59c586d3) worked with Norwegian business registry on a pilot exploring the use of Arbitrum to manage the captables of unlisted companies
- Procurement
    - EY OpsChain
    - Baseline protocol
    - [Hedera x ServiceNow](https://hedera.com/users/servicenow)
- Payroll & Invoicing
    - [Copperx](https://twitter.com/CopperxHQ) - Simple, compliant crypto invoicing and business payments
    - [Loop Crypto](https://www.loopcrypto.xyz/) - Subscription billing and recurring crypto payments
    - [Request Finance](https://www.request.finance/) - Invoicing, payroll, and expense management in stablecoins with export to accounting tools
    - [Toku](https://www.notion.so/SXSW-279d34f360e4816287c1c260adc3c48c?pvs=21) - Compliant stablecoin payroll
    - [Smart Invoice](https://www.smartinvoice.xyz/) - Milestone-based escrow for service agreements
- Legal Agreements / Contracting (Incumbents: DocuSign, [LegalZoom](https://www.legalzoom.com/), [Clerky](https://www.clerky.com/), [ZenBusiness](https://www.zenbusiness.com/))
    - MetaLex: [LexscroW](https://app.metalex.tech/lexscrow) + [Cybercorp SAFE](https://cybercorps.metalex.tech/) investment agreements - Gabriel Shapiro, Erich Dylus
        - [explainer](https://x.com/SYNEX98_36/status/1977301816061640962)
        - [“putting legal entities onchain”](https://x.com/lex_node/status/1977396587769852104)
    - [CamoSign](https://camosign.io/) - Erich Dylus
    - [OpenLaw](https://www.openlaw.io/) (defunct) - Early Ricardian smart contracts - Aaron Wright
    - [LexTek](https://lextek.eth.limo/) - Legal automation tooling - Ross Campbell
    - [EthSign](https://sign.global/ethsign) - e-signatures linked directly to onchain actions
    - [EY OpsChain Contract Manager](https://blockchain.ey.com/products/ocm) - ZK-enabled contract execution, milestone enforcement, and privacy-preserving record-keeping
- Company Formation (Incumbent: [Stripe Atlas](https://stripe.com/atlas))
    - [Otoco](https://otoco.io/) - Mint, manage, and govern legal entities directly onchain
    - [Wrappr](https://www.wrappr.wtf/) - Tokenized wrapper for DAOs and onchain organizations
- [Hats Protocol](https://www.hatsprotocol.xyz/) - Roles/permissions management
- Governance / DAOs
    - [Lighthouse](https://lighthouse.cx/) - Contributor registry and DAO ops tooling (e.g. ENS DAO)
    - [Aragon](https://aragon.org/) - DAO framework for proposals and governance
    - [Decent DAO](https://decent.build/) - Safe-based governance, roles, proposals, and budgeting
    - [Powerhouse](https://www.powerhouse.inc/) - Distributed ERP for governance, finance, and operations, originally DAO-inspired but extensible to any org
    - [Negation Game](https://negationgame.com/) - Governance/game-theory experimentation (Connor McM)
    - [Butter](https://butter.markets/) - Futarchy-driven governance primitives
    - [MetaDAO](https://metadao.fi/) - Futarchy-based governance and coordination

**Research**

- [A future triple entry accounting framework using blockchain technology](https://www.sciencedirect.com/science/article/pii/S2096720921000324) (2021) - a triple-entry accounting could deliver real-time insights into business operations
- [Business Process Model and Notation](https://en.wikipedia.org/wiki/Business_Process_Model_and_Notation)
    - [TABS: Transforming automatically BPMN models into blockchain smart contracts](https://www.sciencedirect.com/science/article/pii/S2096720922000562) (2023) - System that converts Business Process Model and Notation (BPMN) workflows directly into smart contracts
    - [Automated mechanism to support trade transactions in smart contracts with upgrade and repair](https://www.sciencedirect.com/science/article/pii/S2096720925000120) (2025) - System for automatically repairing and redeploying smart contracts when unforeseen events prevent transaction completion
