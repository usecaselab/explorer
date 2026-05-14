import React, { useEffect, useState, useMemo, useRef } from 'react'
import type { IdeaEntry } from './IdeaPage'
import Shape2D, { type ShapeType } from './Shape2D'
import { fetchAllIdeas } from '../lib/api'

// 16 PR domains, each with its own color and shape
const DOMAIN_CONFIG: Record<string, { label: string; color: string; shape: ShapeType }> = {
  'ai':                    { label: 'AI',                    color: '#0891B2', shape: 'icosahedron' },
  'business-operations':   { label: 'Business Ops',          color: '#2563EB', shape: 'stellaOctangula' },
  'civil-society':         { label: 'Civil Society',         color: '#7C3AED', shape: 'mobius' },
  'commerce':              { label: 'Commerce',              color: '#F97316', shape: 'sphere' },
  'environment':           { label: 'Environment',           color: '#15803D', shape: 'dodecahedron' },
  'finance':               { label: 'Finance',               color: '#059669', shape: 'ziggurat' },
  'food-and-agriculture':  { label: 'Food & Agriculture',    color: '#84CC16', shape: 'capsule' },
  'government':            { label: 'Government',            color: '#6B21A8', shape: 'hyperbolicParaboloid' },
  'health':                { label: 'Health',                color: '#DC2626', shape: 'torus' },
  'identity':              { label: 'Identity',              color: '#F43F5E', shape: 'cone' },
  'insurance':             { label: 'Insurance',             color: '#475569', shape: 'antiprism' },
  'logistics-and-trade':   { label: 'Logistics & Trade',     color: '#B45309', shape: 'cylinder' },
  'media':                 { label: 'Media',                 color: '#EC4899', shape: 'ring' },
  'real-estate-and-housing': { label: 'Real Estate',         color: '#CA8A04', shape: 'latheDiamond' },
  'science':               { label: 'Science',               color: '#4F46E5', shape: 'lattice' },
  'utilities':             { label: 'Utilities',             color: '#14B8A6', shape: 'tubeHelix' },
}

function getDomainConfig(domains: string[]) {
  for (const d of domains) {
    if (DOMAIN_CONFIG[d]) return DOMAIN_CONFIG[d]
  }
  return DOMAIN_CONFIG['ai']
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

export { getDomainConfig, DOMAIN_CONFIG }

interface IdeaShowcaseProps {
  onSelect: (idea: IdeaEntry, allIdeas: IdeaEntry[]) => void
  searchQuery?: string
  onClearSearch?: () => void
}

export default function IdeaShowcase({
  onSelect,
  searchQuery = '',
  onClearSearch,
}: IdeaShowcaseProps) {
  const [ideas, setIdeas] = useState<IdeaEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  // Tracks which card the cursor is over. One state at the parent (rather
  // than per-card) so 122 cards don't each hold their own useState — the
  // map already rebuilds on each render anyway.
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    fetchAllIdeas()
      .then((rows) => {
        const valid: IdeaEntry[] = rows.map((row) => ({
          id: row.id,
          title: row.title,
          problem: row.problem,
          solutionSketch: row.solutionSketch,
          whyEthereum: row.whyEthereum,
          domains: row.domains,
          author: row.author,
          createdAt: row.createdAt,
        }))
        // Stable shuffle: only on initial load, to vary the home page.
        for (let i = valid.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [valid[i], valid[j]] = [valid[j], valid[i]]
        }
        setIdeas(valid)
      })
      .catch((err) => {
        console.warn('Failed to load ideas', err)
      })
      .finally(() => setLoading(false))
  }, [])

  const PAGE_SIZE = 20
  const [page, setPage] = useState(0)

  useEffect(() => { setPage(0) }, [activeCategory, searchQuery])

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return ideas.filter(idea => {
      if (activeCategory !== 'all' && !idea.domains.includes(activeCategory)) return false
      if (!q) return true
      return (
        idea.title.toLowerCase().includes(q) ||
        idea.problem.toLowerCase().includes(q) ||
        idea.solutionSketch.toLowerCase().includes(q) ||
        idea.domains.some(d => (DOMAIN_CONFIG[d]?.label || d).toLowerCase().includes(q))
      )
    })
  }, [ideas, activeCategory, searchQuery])

  const visible = filtered.slice(0, (page + 1) * PAGE_SIZE)
  const hasMore = visible.length < filtered.length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 border-2 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    // min-h-screen guarantees enough scrollable area below the cards so the
    // user can always scroll far enough to bring the sticky category row up
    // against the search bar — even when the filtered list is short.
    <section className="w-full max-w-6xl px-4 sm:px-6 pb-8 sm:pb-12 md:pb-16 min-h-screen">
      <CategoryCarousel
        activeCategory={activeCategory}
        onSelect={(id) => setActiveCategory(activeCategory === id ? 'all' : id)}
      />

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {visible.map(idea => {
          const conf = getDomainConfig(idea.domains)
          return (
            <div
              key={idea.id}
              className="group relative rounded-xl border border-gray-100 dark:border-gray-900 hover:border-gray-200 dark:hover:border-gray-800 transition-all hover:shadow-sm overflow-hidden"
            >
              <a
                href={`/idea/${idea.id}`}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
                  e.preventDefault()
                  onSelect(idea, ideas)
                }}
                onMouseEnter={() => setHoveredId(idea.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="text-left flex flex-row sm:flex-col w-full no-underline text-inherit"
              >
                <div className="relative w-24 h-24 sm:w-full sm:aspect-[4/3] sm:h-auto bg-gray-50/50 dark:bg-neutral-900/50 flex-shrink-0">
                  <Shape2D
                    shape={conf.shape}
                    color={conf.color}
                    hovered={hoveredId === idea.id}
                    seed={idea.id}
                    autoRotate
                  />
                </div>
                <div className="p-3 sm:p-4 flex flex-col justify-center min-w-0">
                  <h3 className="font-heading text-sm font-bold text-black dark:text-white leading-snug mb-1">
                    {idea.title}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-2 mb-2">
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
              </a>
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
            <p className="font-heading text-xl sm:text-2xl font-bold text-black dark:text-white mb-2">
              {hasSearch
                ? <>No ideas match &ldquo;<span className="text-gray-500 dark:text-gray-400">{searchQuery.trim()}</span>&rdquo;</>
                : 'No ideas match this filter'}
            </p>
            {(hasSearch || hasFilter) && (
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
                {hasSearch && hasFilter
                  ? <>Filtered by <span className="text-gray-600 dark:text-gray-300">{activeLabel}</span>. Try broadening your search or clearing the filter.</>
                  : hasFilter
                    ? <>Filtered by <span className="text-gray-600 dark:text-gray-300">{activeLabel}</span>.</>
                    : 'Try a different search term or browse by category.'}
              </p>
            )}
            <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
              {hasSearch && onClearSearch && (
                <button
                  onClick={onClearSearch}
                  className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Clear search
                </button>
              )}
              {hasFilter && (
                <button
                  onClick={() => setActiveCategory('all')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-neutral-900 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors"
                >
                  Clear filter
                </button>
              )}
            </div>

            {suggestions.length > 0 && (
              <div className="max-w-3xl mx-auto">
                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-4">
                  Or explore these
                </p>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 text-left">
                  {suggestions.map(idea => {
                    const conf = getDomainConfig(idea.domains)
                    return (
                      <a
                        key={idea.id}
                        href={`/idea/${idea.id}`}
                        onClick={(e) => {
                          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
                          e.preventDefault()
                          onSelect(idea, ideas)
                        }}
                        onMouseEnter={() => setHoveredId(idea.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className="group flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-900 hover:border-gray-200 dark:hover:border-gray-800 hover:shadow-sm transition-all p-3 text-left no-underline text-inherit"
                      >
                        <div className="w-12 h-12 flex-shrink-0 bg-gray-50/50 dark:bg-neutral-900/50 rounded-lg overflow-hidden">
                          <Shape2D
                            shape={conf.shape}
                            color={conf.color}
                            hovered={hoveredId === idea.id}
                            seed={idea.id}
                            autoRotate
                          />
                        </div>
                        <span className="font-heading text-sm font-bold text-black dark:text-white leading-snug line-clamp-2">
                          {idea.title}
                        </span>
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })()}

      {filtered.length === 0 && ideas.length === 0 && (
        <p className="text-center text-gray-400 dark:text-gray-500 text-lg py-12">
          No ideas available.
        </p>
      )}
    </section>
  )
}

function CategoryCarousel({
  activeCategory,
  onSelect,
}: {
  activeCategory: string
  onSelect: (id: string) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  // Until this timestamp, autoscroll is paused. Set to Infinity while a
  // pointer/finger is down; set to (now + grace) on release so iOS momentum
  // scrolling can complete before we touch scrollLeft again.
  const pauseUntilRef = useRef(0)
  // Independent pause that stays in effect for as long as the user has a
  // category selected. Survives hover/touch release.
  const categoryLockedRef = useRef(activeCategory !== 'all')
  categoryLockedRef.current = activeCategory !== 'all'
  // Set true on mouseup if the user dragged past the threshold; the
  // immediately-following click is then swallowed in onClickCapture so
  // dragging never accidentally selects a chip.
  const suppressClickRef = useRef(false)
  const entries = Object.entries(DOMAIN_CONFIG)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let last = performance.now()
    let pos = el.scrollLeft
    const SPEED = 30 // px per second

    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      if (categoryLockedRef.current || now < pauseUntilRef.current) {
        // Track user/momentum-driven position so resume picks up here.
        pos = el.scrollLeft
      } else if (el.scrollWidth > el.clientWidth) {
        const half = el.scrollWidth / 2
        pos += SPEED * dt
        if (half > 0 && pos >= half) pos -= half
        el.scrollLeft = pos
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const holdPause = () => { pauseUntilRef.current = Number.POSITIVE_INFINITY }
  const releaseDesktop = () => { pauseUntilRef.current = performance.now() + 500 }
  // Long grace on touch release so iOS momentum scroll can finish without us
  // overwriting scrollLeft mid-fling.
  const releaseTouch = () => { pauseUntilRef.current = performance.now() + 2500 }
  const onWheel = () => {
    if (pauseUntilRef.current === Number.POSITIVE_INFINITY) return
    pauseUntilRef.current = performance.now() + 1500
  }

  // Click-and-drag horizontal scroll on desktop. Attaches mousemove/mouseup
  // to window so the drag survives the cursor leaving the scroller.
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const el = scrollRef.current
    if (!el) return
    const startX = e.clientX
    const startScroll = el.scrollLeft
    let moved = false

    holdPause()
    el.style.cursor = 'grabbing'
    document.body.style.userSelect = 'none'

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX
      if (Math.abs(dx) > 3) moved = true
      el.scrollLeft = startScroll - dx
    }

    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      el.style.cursor = ''
      document.body.style.userSelect = ''
      if (moved) {
        // The synchronous click that the browser fires after this mouseup
        // would otherwise toggle a chip. Suppress it once.
        suppressClickRef.current = true
        setTimeout(() => { suppressClickRef.current = false }, 0)
      }
      releaseDesktop()
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const onClickCapture = (e: React.MouseEvent) => {
    if (suppressClickRef.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <div
      className="sticky z-10 -mx-4 sm:-mx-6 mb-8 sm:mb-12 bg-white dark:bg-neutral-950 border-b border-gray-100 dark:border-gray-900"
      style={{ top: 'var(--sticky-header-h, 80px)' }}
    >
      <div className="relative">
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto py-3 cursor-grab [&::-webkit-scrollbar]:hidden [scrollbar-width:none] touch-pan-x overscroll-x-contain"
        onMouseEnter={holdPause}
        onMouseLeave={releaseDesktop}
        onMouseDown={onMouseDown}
        onClickCapture={onClickCapture}
        onTouchStart={holdPause}
        onTouchEnd={releaseTouch}
        onTouchCancel={releaseTouch}
        onWheel={onWheel}
      >
        {/* Duplicate the list so we can seamlessly wrap scrollLeft at the
            halfway mark for a continuous carousel. */}
        {[...entries, ...entries].map(([id, cfg], i) => {
          const active = activeCategory === id
          return (
            <button
              key={`${id}-${i}`}
              onClick={() => onSelect(id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                active
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-neutral-900 dark:text-gray-400 dark:hover:bg-neutral-800'
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: active ? 'currentColor' : cfg.color }}
              />
              {cfg.label}
            </button>
          )
        })}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-4 sm:w-6 bg-gradient-to-r from-white dark:from-neutral-950 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-4 sm:w-6 bg-gradient-to-l from-white dark:from-neutral-950 to-transparent z-10" />
      </div>
    </div>
  )
}
