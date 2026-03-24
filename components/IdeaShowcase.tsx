import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import type { IdeaEntry } from './IdeaPage'
import Shape3D, { ShapeType } from './Shape3D'

// 16 PR domains, each with its own color and shape
const DOMAIN_CONFIG: Record<string, { label: string; color: string; shape: ShapeType }> = {
  'ai':                    { label: 'AI',                    color: '#0891B2', shape: 'icosahedron' },
  'business-operations':   { label: 'Business Ops',          color: '#2563EB', shape: 'box' },
  'civil-society':         { label: 'Civil Society',         color: '#7C3AED', shape: 'torusKnot' },
  'commerce':              { label: 'Commerce',              color: '#F97316', shape: 'sphere' },
  'environment':           { label: 'Environment',           color: '#65A30D', shape: 'dodecahedron' },
  'finance':               { label: 'Finance',               color: '#059669', shape: 'octahedron' },
  'food-and-agriculture':  { label: 'Food & Agriculture',    color: '#84CC16', shape: 'dodecahedron' },
  'government':            { label: 'Government',            color: '#8B5CF6', shape: 'torusKnot' },
  'health':                { label: 'Health',                color: '#DC2626', shape: 'torus' },
  'identity':              { label: 'Identity',              color: '#A855F7', shape: 'cone' },
  'insurance':             { label: 'Insurance',             color: '#34D399', shape: 'octahedron' },
  'logistics-and-trade':   { label: 'Logistics & Trade',     color: '#3B82F6', shape: 'box' },
  'media':                 { label: 'Media',                 color: '#EC4899', shape: 'sphere' },
  'real-estate-and-housing': { label: 'Real Estate',         color: '#CA8A04', shape: 'cone' },
  'science':               { label: 'Science',               color: '#7E22CE', shape: 'icosahedron' },
  'utilities':             { label: 'Utilities',             color: '#14B8A6', shape: 'torus' },
}

const CATEGORIES = [
  { id: 'all', label: 'All' },
  ...Object.entries(DOMAIN_CONFIG).map(([id, cfg]) => ({ id, label: cfg.label })),
]

function getDomainConfig(domains: string[]) {
  for (const d of domains) {
    if (DOMAIN_CONFIG[d]) return DOMAIN_CONFIG[d]
  }
  return DOMAIN_CONFIG['ai']
}

function parseFrontmatter(content: string) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/)
  if (!match) return { meta: {} as Record<string, string>, body: content }
  const meta: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let val = line.slice(idx + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    meta[key] = val
  }
  return { meta, body: content.slice(match[0].length) }
}

function parseSection(body: string, heading: string): string {
  const regex = new RegExp(`## ${heading}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`)
  const match = body.match(regex)
  return match ? match[1].trim() : ''
}

function parseLinks(body: string, heading: string) {
  const raw = parseSection(body, heading)
  if (!raw) return []
  const links: { name: string; url: string; description: string }[] = []
  for (const line of raw.split('\n')) {
    const m = line.match(/^- \[([^\]]+)\]\(([^)]+)\)(?:\s*-\s*(.*))?$/)
    if (m) links.push({ name: m[1], url: m[2], description: m[3] || '' })
  }
  return links
}

function parseIdeaMarkdown(content: string, id: string): IdeaEntry {
  const { meta, body } = parseFrontmatter(content)
  return {
    id,
    title: meta.title || id,
    problem: parseSection(body, 'Problem'),
    solutionSketch: parseSection(body, 'Solution'),
    whyEthereum: parseSection(body, 'Why Ethereum'),
    domains: (meta.domains || '').split(',').map(d => d.trim()).filter(Boolean),
    resources: parseLinks(body, 'Resources'),
    examples: parseLinks(body, 'Examples'),
  }
}

function ScrollTrigger({ onVisible }: { onVisible: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const cb = useRef(onVisible)
  cb.current = onVisible

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) cb.current() },
      { rootMargin: '400px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return <div ref={ref} className="h-1" />
}

export { getDomainConfig, DOMAIN_CONFIG, parseIdeaMarkdown }

interface IdeaShowcaseProps {
  onSelect: (idea: IdeaEntry, allIdeas: IdeaEntry[]) => void
}

export default function IdeaShowcase({ onSelect }: IdeaShowcaseProps) {
  const [ideas, setIdeas] = useState<IdeaEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/data/ideas/manifest.json')
        const manifest: string[] = await res.json()

        const loaded = await Promise.all(
          manifest.map(async (filename) => {
            const response = await fetch(`/data/ideas/${filename}`)
            if (!response.ok) return null
            const text = await response.text()
            return parseIdeaMarkdown(text, filename.replace('.md', ''))
          })
        )

        const valid = loaded.filter(Boolean) as IdeaEntry[]
        for (let i = valid.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [valid[i], valid[j]] = [valid[j], valid[i]]
        }
        setIdeas(valid)
      } catch (err) {
        console.warn('Failed to load ideas', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const PAGE_SIZE = 20
  const [page, setPage] = useState(0)

  useEffect(() => { setPage(0) }, [activeCategory])

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return ideas
    return ideas.filter(idea => idea.domains.includes(activeCategory))
  }, [ideas, activeCategory])

  const visible = filtered.slice(0, (page + 1) * PAGE_SIZE)
  const hasMore = visible.length < filtered.length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
      {/* Category Filter */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-2 mb-8 sm:mb-12">
        <div className="flex sm:flex-wrap sm:justify-center gap-1.5 sm:gap-2 min-w-max sm:min-w-0">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id
            const count = cat.id === 'all'
              ? ideas.length
              : ideas.filter(i => i.domains.includes(cat.id)).length
            const conf = DOMAIN_CONFIG[cat.id]
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {conf && (
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: isActive ? '#fff' : conf.color }}
                  />
                )}
                {cat.label}
                <span className={`text-xs ${isActive ? 'text-gray-400' : 'text-gray-400'}`}>{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {visible.map(idea => {
          const conf = getDomainConfig(idea.domains)
          return (
            <button
              key={idea.id}
              onClick={() => onSelect(idea, ideas)}
              className="group text-left flex flex-row sm:flex-col rounded-xl border border-gray-100 hover:border-gray-200 transition-all hover:shadow-sm overflow-hidden"
            >
              <div className="w-24 h-24 sm:w-full sm:aspect-[4/3] sm:h-auto bg-gray-50/50 flex-shrink-0">
                <Shape3D shape={conf.shape} color={conf.color} />
              </div>
              <div className="p-3 sm:p-4 flex flex-col justify-center min-w-0">
                <h3 className="font-heading text-sm font-bold text-black leading-snug mb-1">
                  {idea.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-2">
                  {idea.problem}
                </p>
                <div className="flex flex-wrap gap-1">
                  {idea.domains.map(d => {
                    const dc = DOMAIN_CONFIG[d]
                    return (
                      <span
                        key={d}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${dc?.color || '#666'}15`, color: dc?.color || '#666' }}
                      >
                        {dc?.label || d}
                      </span>
                    )
                  })}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {hasMore && <ScrollTrigger onVisible={() => setPage(p => p + 1)} />}

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 text-lg py-12">
          No ideas in this category yet.
        </p>
      )}
    </section>
  )
}
