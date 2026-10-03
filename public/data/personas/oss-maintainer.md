---
id: oss-maintainer
name: OSS Maintainer
portraits:
  - name: Lukas
    role: Library maintainer
    location: Vienna
    icon: code
  - name: Adaeze
    role: Open-source contributor
    location: Lagos
    icon: terminal
  - name: Felipe
    role: Build tool author
    location: Porto Alegre
    icon: wrench
desires:
  - id: paid-for-value-i-drive
    title: "I want the companies that depend on my library to actually pay for it"
    framing: |
      Fortune 500 services import my package millions of times a month and the tip jar still has $40 in it, because there's no point in the build chain where commercial use triggers payment. If a license could meter commercial usage and route a small fee back through the dependency graph, the companies shipping my code in production would pay automatically instead of when someone remembers to.
  - id: trustworthy-builds
    title: "I want the people installing my package to know the build they got is the one I shipped"
    framing: |
      A compromised build server or a stolen publish token can ship malware under my name, and the people who install my package have no way to check that the artifact they pulled matches the source I actually released, as the xz backdoor showed. If each release were signed and its provenance committed onchain, any installer or CI pipeline could verify the binary came from me and refuse anything that does not match.
  - id: identity-across-forges
    title: "I want my contribution history to be mine, not locked to one platform's account"
    framing: |
      My commits, reviews, and releases live inside one company's account, and if it suspends me, gets acquired, or I move to a self-hosted forge, years of provable work vanish with the login. An identity I control, with contributions attested onchain by the projects and forges I work across, lets me carry that record between GitHub, Codeberg, and anywhere else without a platform's permission.
  - id: split-funding-fairly
    title: "I want sponsorship to reach every contributor who keeps this project alive, not just me"
    framing: |
      Sponsorship money lands in the lead maintainer's account while the dozen people who triage issues and write patches see none of it, because there is no easy way to divide a recurring sponsorship across a changing set of contributors. A split contract that routes incoming funds to current contributors by shares the project sets and can update pays the whole team automatically instead of relying on one person to redistribute by hand.
---

# OSS Maintainer
