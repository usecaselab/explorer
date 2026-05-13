import type { ShapeType } from '../components/Shape3D'

export interface RFP {
  id: string
  title: string
  tagline: string
  color: string
  shape: ShapeType
}

// Six current RFPs. Content for each detail page lands later — for now each
// /rfp/:id renders a placeholder.
export const RFPS: RFP[] = [
  {
    id: 'city-coordination-rails',
    title: 'Coordination rails for city governments and urban systems',
    tagline: 'Verifiable infrastructure for permits, services, and civic data flow between agencies and residents.',
    color: '#2563EB',
    shape: 'torusKnot',
  },
  {
    id: 'trust-infrastructure',
    title: 'Truth infrastructure and information sovereignty',
    tagline: 'Provenance, attestations, and credential systems that let people own and verify the information they rely on.',
    color: '#7C3AED',
    shape: 'icosahedron',
  },
  {
    id: 'ip-and-knowledge-commons',
    title: 'Intellectual property and knowledge commons',
    tagline: 'New mechanisms for funding, licensing, and sharing creative and scientific work on neutral rails.',
    color: '#F97316',
    shape: 'dodecahedron',
  },
  {
    id: 'onchain-organizations',
    title: 'Onchain organizations',
    tagline: 'Programmable structures for companies, nonprofits, and cooperatives — governance, treasury, payroll, ownership.',
    color: '#059669',
    shape: 'octahedron',
  },
  {
    id: 'risk-coverage-and-insurance',
    title: 'Insurance for Underserved Risks',
    tagline: 'Pooled risk, parametric coverage, and reinsurance primitives that work without a central underwriter.',
    color: '#DC2626',
    shape: 'sphere',
  },
  {
    id: 'sovereign-internet-stack',
    title: 'Sovereign internet stack',
    tagline: 'Naming, identity, storage, and compute layers that resist capture by any single platform or jurisdiction.',
    color: '#0891B2',
    shape: 'torus',
  },
]

export function findRFP(id: string): RFP | undefined {
  return RFPS.find((r) => r.id === id)
}
