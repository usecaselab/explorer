import React from 'react'
import { ChevronLeft } from 'lucide-react'
import Shape2D from './Shape2D'
import { getDomainConfig, DOMAIN_CONFIG } from './IdeaShowcase'
import { personaColor, portraitIcon } from '../lib/personas'
import { useEscapeKey } from '../lib/useEscapeKey'
import type { Persona, Idea } from '../lib/api'
import type { IdeaEntry } from './IdeaPage'

interface PersonaPageProps {
  persona: Persona
  ideas: Idea[] // all ideas, used to resolve idea-ids in desires
  onBack: () => void
  onSelectIdea: (idea: IdeaEntry) => void
  onSelectPersona: (personaId: string) => void
}

export default function PersonaPage({
  persona,
  ideas,
  onBack,
  onSelectIdea,
  onSelectPersona,
}: PersonaPageProps) {
  useEscapeKey(true, onBack)

  const color = personaColor(persona.id)
  const ideaById = new Map(ideas.map((i) => [i.id, i]))

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4 pb-6 sm:pb-8">
      <button
        onClick={onBack}
        aria-label="Back"
        className="mb-3 sm:mb-4 inline-flex items-center justify-center px-3 py-2 rounded-lg bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Title */}
      <div className="relative mb-10 sm:mb-14">
        <span
          aria-hidden="true"
          className="absolute -top-2 left-0 h-1 w-12"
          style={{ backgroundColor: color }}
        />
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight text-black dark:text-white pt-6">
          {persona.name}
        </h1>
      </div>

      {/* Portraits — compact example people */}
      {persona.portraits.length > 0 && (
        <section className="mb-12 sm:mb-16">
          <div className="flex flex-wrap gap-3">
            {persona.portraits.map((portrait) => {
              const Icon = portraitIcon(portrait.icon)
              return (
                <div
                  key={portrait.name}
                  className="inline-flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-900 px-4 py-3"
                >
                  <span
                    className="flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${color}14`, color }}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                  </span>
                  <span className="text-sm leading-snug">
                    <span className="font-heading font-bold text-black dark:text-white">
                      {portrait.name}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      , {portrait.role}, {portrait.location}
                    </span>
                  </span>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Desires */}
      <section className="mb-14 sm:mb-20">
        <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">
          Desires
        </h2>
        <div className="space-y-12 sm:space-y-16">
          {persona.desires.map((desire, idx) => (
            <div key={desire.id}>
              <div className="flex items-baseline gap-3 mb-4">
                <span
                  className="font-heading text-sm font-bold text-gray-300 dark:text-gray-700"
                  style={{ minWidth: '2ch' }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold leading-tight tracking-tight text-black dark:text-white">
                  {desire.title}
                </h3>
              </div>
              <p className="ml-0 sm:ml-[3ch] text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6 max-w-3xl">
                {desire.framing}
              </p>

              {desire.ideas.length > 0 && (
                <div className="ml-0 sm:ml-[3ch] grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                  {desire.ideas.map((ideaId) => {
                    const idea = ideaById.get(ideaId)
                    if (!idea) return null
                    const conf = getDomainConfig(idea.domains)
                    const entry: IdeaEntry = {
                      id: idea.id,
                      title: idea.title,
                      problem: idea.problem,
                      solutionSketch: idea.solutionSketch,
                      whyEthereum: idea.whyEthereum,
                      domains: idea.domains,
                      author: idea.author,
                      createdAt: idea.createdAt,
                      updatedAt: idea.updatedAt,
                    }
                    return (
                      <a
                        key={idea.id}
                        href={`/idea/${idea.id}`}
                        onClick={(e) => {
                          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
                          e.preventDefault()
                          onSelectIdea(entry)
                        }}
                        className="group flex flex-row sm:flex-col rounded-xl border border-gray-100 dark:border-gray-900 hover:border-gray-200 dark:hover:border-gray-800 hover:shadow-sm transition-all overflow-hidden no-underline text-inherit"
                      >
                        <div className="relative w-24 h-24 sm:w-full sm:aspect-[4/3] sm:h-auto bg-gray-50/50 dark:bg-neutral-900/50 flex-shrink-0">
                          <Shape2D
                            shape={conf.shape}
                            color={conf.color}
                            seed={idea.id}
                            autoRotate
                          />
                        </div>
                        <div className="p-3 sm:p-4 flex flex-col justify-center min-w-0">
                          <h4 className="font-heading text-sm font-bold text-black dark:text-white leading-snug mb-1">
                            {idea.title}
                          </h4>
                          <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-2">
                            {idea.problem}
                          </p>
                        </div>
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Related personas */}
      {persona.related.length > 0 && (
        <section className="pt-8 sm:pt-12 border-t border-gray-100 dark:border-gray-900">
          <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
            People facing similar desires
          </h2>
          <div className="flex flex-wrap gap-2">
            {persona.related.map((r) => {
              const rColor = personaColor(r.id)
              return (
                <a
                  key={r.id}
                  href={`/persona/${r.id}`}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
                    e.preventDefault()
                    onSelectPersona(r.id)
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300 no-underline"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: rColor }}
                  />
                  {r.name}
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {r.shared} shared
                  </span>
                </a>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
