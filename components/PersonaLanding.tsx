import React, { useEffect, useMemo, useState } from 'react'
import { fetchAllPersonas, type Persona, type Idea } from '../lib/api'
import { personaColor, personaIcon } from '../lib/personas'

interface PersonaLandingProps {
  onSelect: (persona: Persona) => void
  searchQuery?: string
  ideas?: Idea[]
}

export default function PersonaLanding({
  onSelect,
  searchQuery = '',
  ideas = [],
}: PersonaLandingProps) {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    fetchAllPersonas()
      .then(setPersonas)
      .catch((err) => console.warn('Failed to load personas', err))
      .finally(() => setLoading(false))
  }, [])

  const ideaTitleById = useMemo(() => {
    const m = new Map<string, string>()
    for (const i of ideas) m.set(i.id, i.title.toLowerCase())
    return m
  }, [ideas])

  // A persona matches if the query hits its name, one of its desire titles,
  // or the title of any idea associated with it.
  const q = searchQuery.trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!q) return personas
    return personas.filter((p) => {
      if (p.name.toLowerCase().includes(q)) return true
      for (const d of p.desires) {
        if (d.title.toLowerCase().includes(q)) return true
        for (const id of d.ideas) {
          if ((ideaTitleById.get(id) || '').includes(q)) return true
        }
      }
      return false
    })
  }, [personas, q, ideaTitleById])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 border-2 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 pb-8 sm:pb-12 md:pb-16">
      {filtered.length === 0 ? (
        <p className="py-16 text-center text-gray-400 dark:text-gray-500">
          No personas match &ldquo;{searchQuery.trim()}&rdquo;.
        </p>
      ) : (
        <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filtered.map((p) => {
            const color = personaColor(p.id)
            const Icon = personaIcon(p.id)
            const hovered = hoveredId === p.id
            return (
              <a
                key={p.id}
                href={`/persona/${p.id}`}
                aria-label={p.name}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
                  e.preventDefault()
                  onSelect(p)
                }}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group flex flex-col items-center justify-start text-center gap-3 sm:gap-4 rounded-2xl border border-gray-100 dark:border-gray-900 hover:border-gray-200 dark:hover:border-gray-800 hover:shadow-sm transition-all px-3 py-7 sm:px-4 sm:py-9 no-underline text-inherit"
                style={{ backgroundColor: hovered ? `${color}0A` : undefined }}
              >
                <span
                  aria-hidden="true"
                  className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-colors duration-200"
                  style={{
                    backgroundColor: hovered ? color : `${color}14`,
                    color: hovered ? '#ffffff' : color,
                  }}
                >
                  <Icon className="w-7 h-7 sm:w-9 sm:h-9" strokeWidth={1.5} />
                </span>
                <h2 className="font-heading text-sm sm:text-base font-bold leading-snug tracking-tight text-black dark:text-white">
                  {p.name}
                </h2>
              </a>
            )
          })}
        </div>
      )}
    </section>
  )
}
