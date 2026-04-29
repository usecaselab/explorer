import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { Sparkles, TrendingUp, Clock, ChevronDown } from 'lucide-react'
import type { IdeaEntry, ExploredProject } from './IdeaPage'
import Shape3D, { ShapeType } from './Shape3D'
import VoteButton from './VoteButton'
import { fetchIdeasBulkState, fetchAllIdeas, fetchOverrides } from '../lib/api'
import { useSession } from '../lib/auth-client'

function applyOverride(idea: IdeaEntry, override: any): IdeaEntry {
  if (!override) return idea
  return {
    ...idea,
    title: override.title || idea.title,
    problem: override.problem || idea.problem,
    solutionSketch: override.solutionSketch || idea.solutionSketch,
    whyEthereum: override.whyEthereum || idea.whyEthereum,
    domains: override.domains || idea.domains,
    resources: override.resources || idea.resources,
  }
}

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
  searchQuery?: string
  refreshNonce?: number
  onClearSearch?: () => void
}

export default function IdeaShowcase({
  onSelect,
  searchQuery = '',
  refreshNonce = 0,
  onClearSearch,
}: IdeaShowcaseProps) {
  const [ideas, setIdeas] = useState<IdeaEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortMode, setSortMode] = useState<'default' | 'votes' | 'latest'>('default')
  const [onlyBuilding, setOnlyBuilding] = useState(false)
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({})
  const [builderCounts, setBuilderCounts] = useState<Record<string, number>>({})
  const [myVotes, setMyVotes] = useState<Set<string>>(new Set())
  const { data: session } = useSession()

  useEffect(() => {
    let cancelled = false
    fetchIdeasBulkState()
      .then((s) => {
        if (cancelled) return
        const vCounts: Record<string, number> = {}
        const bCounts: Record<string, number> = {}
        for (const id of Object.keys(s.counts)) {
          vCounts[id] = s.counts[id].votes
          bCounts[id] = s.counts[id].builders
        }
        setVoteCounts(vCounts)
        setBuilderCounts(bCounts)
        setMyVotes(new Set(s.myVotes))
      })
      .catch(() => {
        // soft-fail — grid still works without vote state
      })
    return () => {
      cancelled = true
    }
  }, [session?.user?.id, refreshNonce])

  useEffect(() => {
    const load = async () => {
      try {
        const [allIdeas, exploredRes, overrides] = await Promise.all([
          fetchAllIdeas(),
          fetch('/data/explored.json'),
          fetchOverrides().catch(() => ({} as Record<string, any>)),
        ])
        const exploredMap: Record<string, ExploredProject[]> = exploredRes.ok ? await exploredRes.json() : {}

        const valid: IdeaEntry[] = allIdeas.map((row) => {
          const idea: IdeaEntry = {
            id: row.id,
            title: row.title,
            problem: row.problem,
            solutionSketch: row.solutionSketch,
            whyEthereum: row.whyEthereum,
            domains: row.domains,
            resources: row.resources.map((r) => ({ ...r, description: r.description ?? '' })),
            author: row.author,
            createdAt: row.createdAt,
          }
          if (exploredMap[idea.id]) idea.explored = exploredMap[idea.id]
          return applyOverride(idea, overrides[idea.id])
        })

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

  useEffect(() => { setPage(0) }, [activeCategory, searchQuery])

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const list = ideas.filter(idea => {
      if (activeCategory !== 'all' && !idea.domains.includes(activeCategory)) return false
      if (onlyBuilding && (builderCounts[idea.id] || 0) === 0) return false
      if (!q) return true
      return (
        idea.title.toLowerCase().includes(q) ||
        idea.problem.toLowerCase().includes(q) ||
        idea.solutionSketch.toLowerCase().includes(q) ||
        idea.domains.some(d => (DOMAIN_CONFIG[d]?.label || d).toLowerCase().includes(q))
      )
    })
    if (sortMode === 'votes') {
      return [...list].sort(
        (a, b) => (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0)
      )
    }
    if (sortMode === 'latest') {
      return [...list].sort(
        (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
      )
    }
    return list
  }, [ideas, activeCategory, onlyBuilding, searchQuery, sortMode, voteCounts, builderCounts])

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
      {/* Sort + filter toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-8 sm:mb-12">
        <button
          onClick={() => setSortMode(sortMode === 'latest' ? 'default' : 'latest')}
          className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
            sortMode === 'latest'
              ? 'bg-black text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Clock className="w-3 h-3 flex-shrink-0" />
          Latest
        </button>
        <button
          onClick={() => setSortMode(sortMode === 'votes' ? 'default' : 'votes')}
          className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
            sortMode === 'votes'
              ? 'bg-black text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <TrendingUp className="w-3 h-3 flex-shrink-0" />
          Most voted
        </button>
        <button
          onClick={() => setOnlyBuilding((b) => !b)}
          className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
            onlyBuilding
              ? 'bg-black text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Sparkles className={`w-3 h-3 flex-shrink-0 ${onlyBuilding ? 'text-white' : 'text-amber-500'}`} />
          Building
        </button>

        <div className="relative ml-auto">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="appearance-none pl-4 pr-9 py-1.5 sm:py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs sm:text-sm font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All domains</option>
            {Object.entries(DOMAIN_CONFIG).map(([id, cfg]) => (
              <option key={id} value={id}>{cfg.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {visible.map(idea => {
          const conf = getDomainConfig(idea.domains)
          const votes = voteCounts[idea.id] || 0
          const voted = myVotes.has(idea.id)
          return (
            <div
              key={idea.id}
              className="group relative rounded-xl border border-gray-100 hover:border-gray-200 transition-all hover:shadow-sm overflow-hidden"
            >
              <button
                onClick={() => onSelect(idea, ideas)}
                className="text-left flex flex-row sm:flex-col w-full"
              >
                <div className="relative w-24 h-24 sm:w-full sm:aspect-[4/3] sm:h-auto bg-gray-50/50 flex-shrink-0">
                  <Shape3D shape={conf.shape} color={conf.color} />
                  {(builderCounts[idea.id] || 0) > 0 && (
                    <span className="absolute top-2 right-2 inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span className="hidden sm:inline">Building</span>
                    </span>
                  )}
                </div>
                <div className="p-3 sm:p-4 flex flex-col justify-center min-w-0 pr-12 sm:pr-3">
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
              <div className="absolute bottom-2 right-2 z-10">
                <VoteButton
                  ideaId={idea.id}
                  votes={votes}
                  voted={voted}
                  size="sm"
                  onChange={(next) => {
                    setVoteCounts((prev) => ({ ...prev, [idea.id]: next.votes }))
                    setMyVotes((prev) => {
                      const copy = new Set(prev)
                      if (next.voted) copy.add(idea.id)
                      else copy.delete(idea.id)
                      return copy
                    })
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {hasMore && <ScrollTrigger onVisible={() => setPage(p => p + 1)} />}

      {filtered.length === 0 && ideas.length > 0 && (() => {
        const hasSearch = searchQuery.trim().length > 0
        const hasFilter = activeCategory !== 'all'
        const activeLabel = hasFilter
          ? (DOMAIN_CONFIG[activeCategory]?.label || activeCategory)
          : ''
        const suggestions = ideas.slice(0, 3)

        return (
          <div className="text-center py-12 sm:py-16">
            <p className="font-heading text-xl sm:text-2xl font-bold text-black mb-2">
              {hasSearch
                ? <>No ideas match &ldquo;<span className="text-gray-500">{searchQuery.trim()}</span>&rdquo;</>
                : 'No ideas match this filter'}
            </p>
            {(hasSearch || hasFilter) && (
              <p className="text-sm text-gray-400 mb-6">
                {hasSearch && hasFilter
                  ? <>Filtered by <span className="text-gray-600">{activeLabel}</span>. Try broadening your search or clearing the filter.</>
                  : hasFilter
                    ? <>Filtered by <span className="text-gray-600">{activeLabel}</span>.</>
                    : 'Try a different search term or browse by category.'}
              </p>
            )}
            <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
              {hasSearch && onClearSearch && (
                <button
                  onClick={onClearSearch}
                  className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Clear search
                </button>
              )}
              {hasFilter && (
                <button
                  onClick={() => setActiveCategory('all')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear filter
                </button>
              )}
            </div>

            {suggestions.length > 0 && (
              <div className="max-w-3xl mx-auto">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
                  Or explore these
                </p>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 text-left">
                  {suggestions.map(idea => {
                    const conf = getDomainConfig(idea.domains)
                    return (
                      <button
                        key={idea.id}
                        onClick={() => onSelect(idea, ideas)}
                        className="group flex items-center gap-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all p-3 text-left"
                      >
                        <div className="w-12 h-12 flex-shrink-0 bg-gray-50/50 rounded-lg overflow-hidden">
                          <Shape3D shape={conf.shape} color={conf.color} />
                        </div>
                        <span className="font-heading text-sm font-bold text-black leading-snug line-clamp-2">
                          {idea.title}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })()}

      {filtered.length === 0 && ideas.length === 0 && (
        <p className="text-center text-gray-400 text-lg py-12">
          No ideas available.
        </p>
      )}
    </section>
  )
}
