import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Persona, Idea } from '../lib/api'
import type { IdeaEntry } from './IdeaPage'
import { personaColor, personaIcon } from '../lib/personas'

// Deterministic [0,1) hash so node scatter is stable across renders.
function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}

interface Pt {
  x: number
  y: number
}

interface Layout {
  personaPos: Record<string, Pt>
  ideaPos: Record<string, Pt>
  edges: Array<[string, string]> // [personaId, ideaId]
  ideaToPersonas: Record<string, string[]>
  personaToIdeas: Record<string, string[]>
}

function computeLayout(personas: Persona[], ideas: Idea[], w: number, h: number): Layout {
  // Padding leaves room for persona labels around the perimeter.
  const padX = 140
  const padTop = 58
  const padBottom = 48
  const rectL = padX
  const rectR = w - padX
  const rectT = padTop
  const rectB = h - padBottom
  const rectW = Math.max(1, rectR - rectL)
  const rectH = Math.max(1, rectB - rectT)
  const cx = (rectL + rectR) / 2
  const cy = (rectT + rectB) / 2
  const minDim = Math.min(rectW, rectH)
  const perim = 2 * rectW + 2 * rectH

  // A point on the rectangle perimeter, t in [0,1), clockwise from top-left.
  const rectPoint = (t: number): Pt => {
    let d = (t % 1) * perim
    if (d < rectW) return { x: rectL + d, y: rectT }
    d -= rectW
    if (d < rectH) return { x: rectR, y: rectT + d }
    d -= rectH
    if (d < rectW) return { x: rectR - d, y: rectB }
    d -= rectW
    return { x: rectL, y: rectB - d }
  }

  // Personas scattered just inside the rectangle perimeter.
  const personaPos: Record<string, Pt> = {}
  personas.forEach((p, i) => {
    const base = rectPoint((i + 0.5) / personas.length)
    let ix = cx - base.x
    let iy = cy - base.y
    const il = Math.hypot(ix, iy) || 1
    ix /= il
    iy /= il
    const inward = hash(p.id + 'in') * minDim * 0.13
    const tang = (hash(p.id + 'tn') - 0.5) * minDim * 0.2
    personaPos[p.id] = {
      x: base.x + ix * inward - iy * tang,
      y: base.y + iy * inward + ix * tang,
    }
  })

  const edges: Array<[string, string]> = []
  const ideaToPersonas: Record<string, string[]> = {}
  const personaToIdeas: Record<string, string[]> = {}
  for (const p of personas) {
    const seen = new Set<string>()
    for (const d of p.desires) {
      for (const ideaId of d.ideas) {
        if (seen.has(ideaId)) continue
        seen.add(ideaId)
        edges.push([p.id, ideaId])
        ;(ideaToPersonas[ideaId] ||= []).push(p.id)
        ;(personaToIdeas[p.id] ||= []).push(ideaId)
      }
    }
  }

  // Ideas cluster in the centre, pulled toward the personas they serve.
  const ideaPos: Record<string, Pt> = {}
  for (const idea of ideas) {
    const ps = ideaToPersonas[idea.id] || []
    let x = cx
    let y = cy
    if (ps.length) {
      let sx = 0
      let sy = 0
      for (const pid of ps) {
        sx += personaPos[pid].x
        sy += personaPos[pid].y
      }
      x = cx + (sx / ps.length - cx) * 0.5
      y = cy + (sy / ps.length - cy) * 0.5
    }
    const jx = (hash(idea.id + 'x') - 0.5) * rectW * 0.12
    const jy = (hash(idea.id + 'y') - 0.5) * rectH * 0.2
    ideaPos[idea.id] = { x: x + jx, y: y + jy }
  }

  return { personaPos, ideaPos, edges, ideaToPersonas, personaToIdeas }
}

type Hover = { type: 'persona'; id: string } | { type: 'idea'; id: string } | null

interface GraphViewProps {
  personas: Persona[]
  ideas: Idea[]
  searchQuery?: string
  onSelectPersona: (id: string) => void
  onSelectIdea: (idea: IdeaEntry) => void
}

export default function GraphView({
  personas,
  ideas,
  searchQuery = '',
  onSelectPersona,
  onSelectIdea,
}: GraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [hover, setHover] = useState<Hover>(null)
  const [view, setView] = useState({ x: 0, y: 0, k: 1 })
  const viewRef = useRef(view)
  viewRef.current = view

  // pan state
  const dragRef = useRef<{ sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null)
  const suppressClickRef = useRef(false)

  // Measure the container.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Wheel zoom toward the cursor (native non-passive listener so the page
  // doesn't scroll).
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = svg.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const v = viewRef.current
      // Zoom in proportion to the scroll delta. A fixed per-event factor zooms
      // far too fast on trackpads / Magic Mouse, which fire many wheel events
      // per gesture; deltaY is clamped so one outsized event can't jump.
      const delta = Math.max(-120, Math.min(120, e.deltaY))
      const factor = Math.exp(-delta * 0.0008)
      const k = Math.min(4, Math.max(0.5, v.k * factor))
      const wx = (mx - v.x) / v.k
      const wy = (my - v.y) / v.k
      setView({ k, x: mx - wx * k, y: my - wy * k })
    }
    svg.addEventListener('wheel', onWheel, { passive: false })
    return () => svg.removeEventListener('wheel', onWheel)
  }, [])

  const layout = useMemo(
    () => (size.w > 0 && size.h > 0 ? computeLayout(personas, ideas, size.w, size.h) : null),
    [personas, ideas, size.w, size.h]
  )

  const ideaById = useMemo(() => new Map(ideas.map((i) => [i.id, i])), [ideas])

  // Search matches.
  const q = searchQuery.trim().toLowerCase()
  const searchActive = q.length > 0
  const matchedPersonas = useMemo(
    () =>
      searchActive
        ? new Set(personas.filter((p) => p.name.toLowerCase().includes(q)).map((p) => p.id))
        : null,
    [personas, q, searchActive]
  )
  const matchedIdeas = useMemo(
    () =>
      searchActive
        ? new Set(ideas.filter((i) => i.title.toLowerCase().includes(q)).map((i) => i.id))
        : null,
    [ideas, q, searchActive]
  )

  // Nodes connected to the hovered node.
  const activeIdeas = useMemo(() => {
    if (!hover || !layout) return null
    if (hover.type === 'persona') return new Set(layout.personaToIdeas[hover.id] || [])
    return new Set([hover.id])
  }, [hover, layout])
  const activePersonas = useMemo(() => {
    if (!hover || !layout) return null
    if (hover.type === 'idea') return new Set(layout.ideaToPersonas[hover.id] || [])
    return new Set([hover.id])
  }, [hover, layout])

  const onMouseDown = (e: React.MouseEvent) => {
    dragRef.current = { sx: e.clientX, sy: e.clientY, ox: view.x, oy: view.y, moved: false }
  }
  const onMouseMove = (e: React.MouseEvent) => {
    const d = dragRef.current
    if (!d) return
    const dx = e.clientX - d.sx
    const dy = e.clientY - d.sy
    if (!d.moved && Math.hypot(dx, dy) > 4) d.moved = true
    if (d.moved) setView((v) => ({ ...v, x: d.ox + dx, y: d.oy + dy }))
  }
  const endDrag = () => {
    if (dragRef.current?.moved) {
      suppressClickRef.current = true
      setTimeout(() => {
        suppressClickRef.current = false
      }, 0)
    }
    dragRef.current = null
  }

  // Render the container unconditionally — even before data arrives — so its
  // ref is attached when the measuring effect runs. Otherwise a direct load of
  // /graph mounts only the spinner, the ResizeObserver never attaches, and the
  // graph stays blank. The spinner shows as an overlay instead.
  const dataLoading = personas.length === 0 || ideas.length === 0

  const isHighlightedEdge = (pid: string, iid: string) =>
    hover != null && (hover.type === 'persona' ? hover.id === pid : hover.id === iid)

  return (
    <section className="w-full flex-1 flex flex-col px-2 sm:px-4">
      <div
        ref={containerRef}
        className="flex-1 relative rounded-2xl border border-gray-100 dark:border-gray-900 overflow-hidden bg-gray-50/40 dark:bg-neutral-900/40"
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="absolute inset-0 select-none"
          style={{ cursor: dragRef.current?.moved ? 'grabbing' : 'grab' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={endDrag}
          onMouseLeave={() => {
            endDrag()
            setHover(null)
          }}
        >
          {layout && (
            <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
              {/* base edges */}
              {layout.edges.map(([pid, iid], i) => {
                if (isHighlightedEdge(pid, iid)) return null
                const a = layout.personaPos[pid]
                const b = layout.ideaPos[iid]
                if (!a || !b) return null
                return (
                  <line
                    key={i}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke="#94a3b8"
                    strokeWidth={1}
                    opacity={hover ? 0.05 : 0.16}
                  />
                )
              })}
              {/* highlighted edges, drawn on top */}
              {layout.edges.map(([pid, iid], i) => {
                if (!isHighlightedEdge(pid, iid)) return null
                const a = layout.personaPos[pid]
                const b = layout.ideaPos[iid]
                if (!a || !b) return null
                return (
                  <line
                    key={`h${i}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke="#f97316"
                    strokeWidth={1.6}
                    opacity={0.75}
                  />
                )
              })}

              {/* idea nodes */}
              {ideas.map((idea) => {
                const pos = layout.ideaPos[idea.id]
                if (!pos) return null
                const isHovered = hover?.type === 'idea' && hover.id === idea.id
                const isMatch = !!matchedIdeas?.has(idea.id)
                const emphasized = isHovered || isMatch
                const dim = activeIdeas
                  ? !activeIdeas.has(idea.id)
                  : searchActive
                    ? !isMatch
                    : false
                const showLabel =
                  isHovered ||
                  isMatch ||
                  (hover?.type === 'persona' && !!activeIdeas?.has(idea.id))
                const side = emphasized ? 17 : 12
                const lw = idea.title.length * 6.5 + 16
                return (
                  <g
                    key={idea.id}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHover({ type: 'idea', id: idea.id })}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => {
                      if (suppressClickRef.current) return
                      const row = ideaById.get(idea.id)
                      if (row) {
                        onSelectIdea({
                          id: row.id,
                          title: row.title,
                          problem: row.problem,
                          solutionSketch: row.solutionSketch,
                          whyEthereum: row.whyEthereum,
                          domains: row.domains,
                          author: row.author,
                          createdAt: row.createdAt,
                          updatedAt: row.updatedAt,
                        })
                      }
                    }}
                  >
                    <circle cx={pos.x} cy={pos.y} r={19} fill="transparent" pointerEvents="all" />
                    <rect
                      x={pos.x - side / 2}
                      y={pos.y - side / 2}
                      width={side}
                      height={side}
                      rx={2}
                      fill={emphasized ? '#f97316' : '#64748b'}
                      opacity={dim ? 0.16 : 0.92}
                    />
                    {showLabel && (
                      <g style={{ pointerEvents: 'none' }}>
                        <rect
                          x={pos.x - lw / 2}
                          y={pos.y - side / 2 - 26}
                          width={lw}
                          height={19}
                          rx={4}
                          fill="rgba(15,15,17,0.93)"
                        />
                        <text
                          x={pos.x}
                          y={pos.y - side / 2 - 26 + 13.5}
                          textAnchor="middle"
                          fontSize={12}
                          fontWeight={500}
                          fill="#ffffff"
                        >
                          {idea.title}
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}

              {/* persona nodes — an accent disc carrying the persona's icon
                  (single source of truth: personaIcon in lib/personas). */}
              {personas.map((p) => {
                const pos = layout.personaPos[p.id]
                if (!pos) return null
                const color = personaColor(p.id)
                const Icon = personaIcon(p.id)
                const isHovered = hover?.type === 'persona' && hover.id === p.id
                const isMatch = !!matchedPersonas?.has(p.id)
                const emphasized = isHovered || isMatch
                const dim = activePersonas
                  ? !activePersonas.has(p.id)
                  : searchActive
                    ? !isMatch
                    : false
                const r = emphasized ? 18 : 15
                const iconSize = r * 1.25
                return (
                  <g
                    key={p.id}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHover({ type: 'persona', id: p.id })}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => {
                      if (!suppressClickRef.current) onSelectPersona(p.id)
                    }}
                  >
                    <circle cx={pos.x} cy={pos.y} r={r + 10} fill="transparent" pointerEvents="all" />
                    <g opacity={dim ? 0.22 : 1} style={{ pointerEvents: 'none' }}>
                      <circle cx={pos.x} cy={pos.y} r={r} fill={color} />
                      <Icon
                        x={pos.x - iconSize / 2}
                        y={pos.y - iconSize / 2}
                        width={iconSize}
                        height={iconSize}
                        color="#ffffff"
                        strokeWidth={2.25}
                      />
                    </g>
                    <text
                      x={pos.x}
                      y={pos.y - r - 9}
                      textAnchor="middle"
                      fontSize={14}
                      fontWeight={700}
                      fill={color}
                      opacity={dim ? 0.3 : 1}
                      style={{ pointerEvents: 'none' }}
                    >
                      {p.name}
                    </text>
                  </g>
                )
              })}
            </g>
          )}
        </svg>
        {dataLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </section>
  )
}
