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
  // `hover` is mouse-only; `pinned` is the touch/keyboard selection. The graph
  // highlights whichever is set — `active` below merges them.
  const [hover, setHover] = useState<Hover>(null)
  const [pinned, setPinned] = useState<Hover>(null)
  const [focusedPersona, setFocusedPersona] = useState<string | null>(null)
  const active: Hover = hover ?? pinned
  const [view, setView] = useState({ x: 0, y: 0, k: 1 })
  const viewRef = useRef(view)
  viewRef.current = view

  // pan state
  const dragRef = useRef<{ sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null)
  const suppressClickRef = useRef(false)
  // Active pointers (mouse/touch/pen unified). Two = pinch-zoom.
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map())
  const pinchRef = useRef<{ startDist: number; startK: number; wx: number; wy: number } | null>(null)
  const lastPointerTypeRef = useRef<string>('mouse')

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

  // Nodes connected to the active (hovered/pinned/focused) node.
  const activeIdeas = useMemo(() => {
    if (!active || !layout) return null
    if (active.type === 'persona') return new Set(layout.personaToIdeas[active.id] || [])
    return new Set([active.id])
  }, [active, layout])
  const activePersonas = useMemo(() => {
    if (!active || !layout) return null
    if (active.type === 'idea') return new Set(layout.ideaToPersonas[active.id] || [])
    return new Set([active.id])
  }, [active, layout])

  // Zoom toward a point in svg-local coordinates, keeping that point fixed.
  const zoomAt = (factor: number, px: number, py: number) => {
    const v = viewRef.current
    const k = Math.min(4, Math.max(0.5, v.k * factor))
    const wx = (px - v.x) / v.k
    const wy = (py - v.y) / v.k
    setView({ k, x: px - wx * k, y: py - wy * k })
  }
  const zoomBy = (factor: number) => zoomAt(factor, size.w / 2, size.h / 2)
  const resetView = () => setView({ x: 0, y: 0, k: 1 })

  // Unified pointer handling: one pointer pans, two pinch-zoom. Covers mouse,
  // touch and pen, so there is no separate touch code path.
  const onPointerDown = (e: React.PointerEvent) => {
    lastPointerTypeRef.current = e.pointerType
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const n = pointersRef.current.size
    if (n === 2) {
      const svg = svgRef.current
      if (!svg) return
      const [a, b] = [...pointersRef.current.values()]
      const rect = svg.getBoundingClientRect()
      const mx = (a.x + b.x) / 2 - rect.left
      const my = (a.y + b.y) / 2 - rect.top
      const v = viewRef.current
      pinchRef.current = {
        startDist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        startK: v.k,
        wx: (mx - v.x) / v.k,
        wy: (my - v.y) / v.k,
      }
      dragRef.current = null // a second finger cancels any in-flight pan
    } else if (n === 1) {
      const v = viewRef.current
      dragRef.current = { sx: e.clientX, sy: e.clientY, ox: v.x, oy: v.y, moved: false }
    }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointersRef.current.has(e.pointerId)) return
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pinchRef.current && pointersRef.current.size >= 2) {
      const svg = svgRef.current
      if (!svg) return
      const [a, b] = [...pointersRef.current.values()]
      const rect = svg.getBoundingClientRect()
      const mx = (a.x + b.x) / 2 - rect.left
      const my = (a.y + b.y) / 2 - rect.top
      const dist = Math.hypot(a.x - b.x, a.y - b.y)
      const p = pinchRef.current
      const k = Math.min(4, Math.max(0.5, p.startK * (dist / p.startDist)))
      setView({ k, x: mx - p.wx * k, y: my - p.wy * k })
      return
    }
    const d = dragRef.current
    if (!d) return
    const dx = e.clientX - d.sx
    const dy = e.clientY - d.sy
    if (!d.moved && Math.hypot(dx, dy) > 4) d.moved = true
    if (d.moved) setView((v) => ({ ...v, x: d.ox + dx, y: d.oy + dy }))
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const wasTap = !!dragRef.current && !dragRef.current.moved
    if (dragRef.current?.moved) {
      suppressClickRef.current = true
      setTimeout(() => {
        suppressClickRef.current = false
      }, 0)
    }
    // A tap on empty canvas clears the pinned (touch) selection.
    if (wasTap && e.pointerType !== 'mouse' && e.target === svgRef.current) setPinned(null)
    pointersRef.current.delete(e.pointerId)
    if (pointersRef.current.size < 2) pinchRef.current = null
    if (pointersRef.current.size === 1) {
      // Lifting one finger of a pinch: hand the remaining finger to pan.
      const [pt] = [...pointersRef.current.values()]
      const v = viewRef.current
      dragRef.current = { sx: pt.x, sy: pt.y, ox: v.x, oy: v.y, moved: true }
    } else if (pointersRef.current.size === 0) {
      dragRef.current = null
    }
  }

  // Touch/pen tap is two-stage: first tap pins (highlights connections), a
  // second tap on the same node activates it. Mouse clicks activate directly.
  const activate = (sel: Exclude<Hover, null>, run: () => void) => {
    if (suppressClickRef.current) return
    if (lastPointerTypeRef.current === 'mouse') {
      run()
      return
    }
    if (pinned && pinned.type === sel.type && pinned.id === sel.id) run()
    else setPinned(sel)
  }

  // Keyboard control of the canvas: arrows pan, +/- zoom, 0 resets, Esc clears.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = 60
    switch (e.key) {
      case 'ArrowLeft':
        setView((v) => ({ ...v, x: v.x + step }))
        break
      case 'ArrowRight':
        setView((v) => ({ ...v, x: v.x - step }))
        break
      case 'ArrowUp':
        setView((v) => ({ ...v, y: v.y + step }))
        break
      case 'ArrowDown':
        setView((v) => ({ ...v, y: v.y - step }))
        break
      case '+':
      case '=':
        zoomBy(1.2)
        break
      case '-':
      case '_':
        zoomBy(1 / 1.2)
        break
      case '0':
        resetView()
        break
      case 'Escape':
        setHover(null)
        setPinned(null)
        break
      default:
        return
    }
    e.preventDefault()
  }

  // Render the container unconditionally — even before data arrives — so its
  // ref is attached when the measuring effect runs. Otherwise a direct load of
  // /graph mounts only the spinner, the ResizeObserver never attaches, and the
  // graph stays blank. The spinner shows as an overlay instead.
  const dataLoading = personas.length === 0 || ideas.length === 0

  const isHighlightedEdge = (pid: string, iid: string) =>
    active != null && (active.type === 'persona' ? active.id === pid : active.id === iid)

  return (
    <section className="w-full flex-1 flex flex-col">
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden bg-gray-50/40 dark:bg-neutral-900/40"
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          tabIndex={0}
          role="application"
          aria-label="Persona and idea graph. Drag to pan, scroll or pinch to zoom. Arrow keys pan, plus and minus zoom, 0 resets."
          className="absolute inset-0 select-none touch-none focus:outline-none"
          style={{ cursor: dragRef.current?.moved ? 'grabbing' : 'grab' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={(e) => {
            if (e.pointerType === 'mouse') setHover(null)
          }}
          onKeyDown={onKeyDown}
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
                    opacity={active ? 0.05 : 0.16}
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
                const isActive = active?.type === 'idea' && active.id === idea.id
                const isMatch = !!matchedIdeas?.has(idea.id)
                const emphasized = isActive || isMatch
                const dim = activeIdeas
                  ? !activeIdeas.has(idea.id)
                  : searchActive
                    ? !isMatch
                    : false
                const showLabel =
                  isActive ||
                  isMatch ||
                  (active?.type === 'persona' && !!activeIdeas?.has(idea.id))
                const side = emphasized ? 17 : 12
                const lw = idea.title.length * 6.5 + 16
                const openIdea = () => {
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
                }
                return (
                  <g
                    key={idea.id}
                    style={{ cursor: 'pointer' }}
                    onPointerEnter={(e) => {
                      if (e.pointerType === 'mouse' && !dragRef.current?.moved)
                        setHover({ type: 'idea', id: idea.id })
                    }}
                    onPointerLeave={(e) => {
                      if (e.pointerType === 'mouse') setHover(null)
                    }}
                    onClick={() => activate({ type: 'idea', id: idea.id }, openIdea)}
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
                const isActive = active?.type === 'persona' && active.id === p.id
                const isMatch = !!matchedPersonas?.has(p.id)
                const emphasized = isActive || isMatch
                const isFocused = focusedPersona === p.id
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
                    tabIndex={0}
                    role="button"
                    aria-label={`Persona: ${p.name}. Activate to open, or hold focus to highlight connected ideas.`}
                    style={{ cursor: 'pointer', outline: 'none' }}
                    onPointerEnter={(e) => {
                      if (e.pointerType === 'mouse' && !dragRef.current?.moved)
                        setHover({ type: 'persona', id: p.id })
                    }}
                    onPointerLeave={(e) => {
                      if (e.pointerType === 'mouse') setHover(null)
                    }}
                    onFocus={() => {
                      setFocusedPersona(p.id)
                      setHover({ type: 'persona', id: p.id })
                    }}
                    onBlur={() => {
                      setFocusedPersona((cur) => (cur === p.id ? null : cur))
                      setHover((cur) => (cur?.type === 'persona' && cur.id === p.id ? null : cur))
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        onSelectPersona(p.id)
                      }
                    }}
                    onClick={() => activate({ type: 'persona', id: p.id }, () => onSelectPersona(p.id))}
                  >
                    <circle cx={pos.x} cy={pos.y} r={r + 10} fill="transparent" pointerEvents="all" />
                    {isFocused && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={r + 5}
                        fill="none"
                        stroke={color}
                        strokeWidth={2.5}
                        opacity={0.9}
                      />
                    )}
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
