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
    id: 'municipalities',
    title: 'Municipal & Urban Coordination',
    tagline: 'How can cities run finance, permitting, transport, and utilities across many actors without lock-in to platforms that expose citizen data?',
    color: '#2563EB',
    shape: 'torusKnot',
  },
  {
    id: 'truth',
    title: 'Shared Reality & Verifiable Truth',
    tagline: 'How can people agree on what is real in the age of deepfakes, psyops, and algorithmic feeds?',
    color: '#7C3AED',
    shape: 'torusKnotQuatrefoil',
  },
  {
    id: 'ip',
    title: 'Intellectual Property & Knowledge Commons',
    tagline: 'What mechanisms can fund, license, and share creative and scientific works as AI models train on and remix them?',
    color: '#F97316',
    shape: 'torusKnotPentagonal',
  },
  {
    id: 'firms',
    title: 'Self-Sovereign Firms',
    tagline: 'How can SMEs, co-ops, and startups run globally while minimizing overhead and trust requirements?',
    color: '#059669',
    shape: 'torusKnotQuintic',
  },
  {
    id: 'risk',
    title: 'Programmable Risk & Safety Nets',
    tagline: 'How can individuals and groups protect against emerging and underserved risks without relying on legacy insurance providers?',
    color: '#DC2626',
    shape: 'torusKnotWoven',
  },
  {
    id: 'internet',
    title: 'Securing the Internet Stack',
    tagline: 'How can the internet function without reliance on intermediaries that can censor, surveil, or fail?',
    color: '#0891B2',
    shape: 'torusKnotComplex',
  },
]

export function findRFP(id: string): RFP | undefined {
  return RFPS.find((r) => r.id === id)
}
