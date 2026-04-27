import React, { useState, useCallback } from 'react'
import { ArrowLeft, ExternalLink, Link, Check, Pencil, Wrench, Sparkles } from 'lucide-react'
import { renderMarkdownLinks } from '../utils'
import Shape3D from './Shape3D'
import { getDomainConfig, DOMAIN_CONFIG } from './IdeaShowcase'

interface IdeaResource {
  name: string
  url: string
  description: string
}

export interface ExploredProject {
  name: string
  builder?: string
  url?: string
  description: string
}

export interface IdeaEntry {
  id: string
  title: string
  problem: string
  solutionSketch: string
  whyEthereum: string
  domains: string[]
  resources: IdeaResource[]
  explored?: ExploredProject[]
}

function domainLabel(d: string): string {
  return d.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

interface IdeaPageProps {
  idea: IdeaEntry
  accentColor: string
  onBack: () => void
  allIdeas?: IdeaEntry[]
  onSelectIdea?: (idea: IdeaEntry) => void
}

export default function IdeaPage({ idea, accentColor, onBack, allIdeas = [], onSelectIdea }: IdeaPageProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  // Related ideas: share at least one domain, exclude current, take first 3
  const relatedIdeas = allIdeas
    .filter(i => i.id !== idea.id && i.domains.some(d => idea.domains.includes(d)))
    .slice(0, 4)

  // Parse capability badge from Why Ethereum text
  const capabilityMatch = idea.whyEthereum?.match(/^(Verifiability|Composability|Enforcement):\s*/)
  const capability = capabilityMatch ? capabilityMatch[1] : null
  const whyExplanation = capabilityMatch
    ? idea.whyEthereum.slice(capabilityMatch[0].length)
    : idea.whyEthereum

  const badgeColors: Record<string, string> = {
    Verifiability: 'bg-blue-50 text-blue-600',
    Composability: 'bg-purple-50 text-purple-600',
    Enforcement: 'bg-green-50 text-green-600',
  }

  const conf = getDomainConfig(idea.domains)

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Back + Copy Link */}
      <div className="flex items-center justify-between mb-8 sm:mb-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={handleCopyLink}
          className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          aria-label="Copy link"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Link className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>

      {/* Hero */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start mb-12 sm:mb-16">
        <div className="w-full md:w-48 aspect-square rounded-2xl overflow-hidden bg-gray-50/50 flex-shrink-0">
          <Shape3D shape={conf.shape} color={conf.color} />
        </div>
        <div className="flex-1 pt-1">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {idea.explored && idea.explored.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <Sparkles className="w-3 h-3" />
                Explored
              </span>
            )}
            {idea.domains.map(d => {
              const dc = DOMAIN_CONFIG[d]
              return (
                <span
                  key={d}
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: `${dc?.color || '#666'}15`, color: dc?.color || '#666' }}
                >
                  {dc?.label || domainLabel(d)}
                </span>
              )
            })}
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-black">
            {idea.title}
          </h1>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-10 sm:space-y-14">
        {/* Problem */}
        {idea.problem && (
          <section>
            <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
              Problem
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
              {renderMarkdownLinks(idea.problem)}
            </p>
          </section>
        )}

        {/* Solution Sketch */}
        {idea.solutionSketch && (
          <section>
            <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
              Solution Sketch
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
              {renderMarkdownLinks(idea.solutionSketch)}
            </p>
          </section>
        )}

        {/* Why Ethereum */}
        {idea.whyEthereum && (
          <section>
            <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
              Why Ethereum
            </h2>
            <div
              className="p-5 sm:p-6 rounded-xl border border-gray-100"
              style={{ backgroundColor: `${accentColor}08` }}
            >
              {capability && (
                <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3 ${badgeColors[capability]}`}>
                  {capability}
                </span>
              )}
              <p className="text-lg text-gray-700 leading-relaxed">
                {renderMarkdownLinks(whyExplanation)}
              </p>
            </div>
          </section>
        )}

        {/* Explored By */}
        {idea.explored && idea.explored.length > 0 && (
          <section>
            <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Explored by the Community
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {idea.explored.map((project, idx) => {
                const inner = (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-heading text-sm font-bold text-black">
                        {project.name}
                      </h3>
                      {project.url && (
                        <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-black transition-colors flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                    {project.builder && (
                      <p className="text-xs text-amber-600 font-medium mt-1">
                        Built by {project.builder}
                      </p>
                    )}
                    {project.description && (
                      <p className="text-sm text-gray-500 leading-relaxed mt-1.5">
                        {project.description}
                      </p>
                    )}
                  </>
                )
                return project.url ? (
                  <a
                    key={idx}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-4 sm:p-5 rounded-xl border border-amber-100 bg-amber-50/30 hover:border-amber-200 transition-colors"
                  >
                    {inner}
                  </a>
                ) : (
                  <div
                    key={idx}
                    className="group p-4 sm:p-5 rounded-xl border border-amber-100 bg-amber-50/30"
                  >
                    {inner}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Resources */}
        {idea.resources.length > 0 && (
          <section>
            <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">
              Resources
            </h2>
            <div className="space-y-2">
              {idea.resources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm text-black group-hover:text-gray-700">
                      {resource.name}
                    </span>
                    {resource.description && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{renderMarkdownLinks(resource.description)}</p>
                    )}
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 flex-shrink-0 mt-0.5" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Toolkit CTA */}
        <section className="p-6 sm:p-8 rounded-2xl bg-gray-50 border border-gray-100">
          <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">
            Use Case Lab
          </h2>
          <h3 className="font-heading text-xl md:text-2xl font-bold text-black mb-3">
            Ready to build this?
          </h3>
          <p className="text-gray-500 leading-relaxed max-w-2xl mb-6">
            Check out the Use Case Lab Toolkit — starter code, Ethereum knowledge, community support, and AI-powered research tools.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/toolkit"
              onClick={(e) => { e.preventDefault(); window.history.pushState(null, '', '/toolkit'); window.dispatchEvent(new PopStateEvent('popstate')); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Wrench className="w-3.5 h-3.5" />
              View Toolkit
            </a>
            <a
              href={`https://github.com/usecaselab/explorer/issues/new?title=${encodeURIComponent(`[Improve] ${idea.title}`)}&body=${encodeURIComponent(`## Idea\n${idea.title} (${idea.domains.map(domainLabel).join(', ')})\n\n## What's wrong or could be better?\n\n`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-medium rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Improve this idea
            </a>
          </div>
        </section>

        {/* Related Ideas */}
        {relatedIdeas.length > 0 && onSelectIdea && (
          <section>
            <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">
              Related Ideas
            </h2>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {relatedIdeas.map(related => {
                const relConf = getDomainConfig(related.domains)
                return (
                  <button
                    key={related.id}
                    onClick={() => onSelectIdea(related)}
                    className="group text-left flex flex-row sm:flex-col rounded-xl border border-gray-100 hover:border-gray-200 transition-all hover:shadow-sm overflow-hidden"
                  >
                    <div className="w-24 h-24 sm:w-full sm:aspect-[4/3] sm:h-auto bg-gray-50/50 flex-shrink-0">
                      <Shape3D shape={relConf.shape} color={relConf.color} />
                    </div>
                    <div className="p-3 sm:p-4 flex flex-col justify-center min-w-0">
                      <h3 className="font-heading text-sm font-bold text-black leading-snug mb-1">
                        {related.title}
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-2">
                        {related.problem}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {related.domains.map(d => {
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
          </section>
        )}
      </div>
    </div>
  )
}
