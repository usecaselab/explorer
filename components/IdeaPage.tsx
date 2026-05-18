import React, { useState, useCallback } from 'react'
import { ExternalLink, Check, Copy, Github, ChevronLeft } from 'lucide-react'
import { renderMarkdownLinks } from '../utils'
import Shape2D from './Shape2D'
import { getDomainConfig, DOMAIN_CONFIG } from './IdeaShowcase'
import { useEscapeKey } from '../lib/useEscapeKey'

const REPO = 'usecaselab/explorer'
const BRANCH = 'main'

export interface IdeaEntry {
  id: string
  title: string
  problem: string
  solutionSketch: string
  whyEthereum: string
  domains: string[]
  author?: string
  createdAt?: string | number
  updatedAt?: string | number
}

function domainLabel(d: string): string {
  return d.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function editOnGithubUrl(id: string): string {
  return `https://github.com/${REPO}/edit/${BRANCH}/public/data/ideas/${id}.md`
}

function formatDate(value: string | number): string {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function ideaAsMarkdown(idea: IdeaEntry): string {
  const parts = [
    `# ${idea.title}`,
    '',
    `Domains: ${idea.domains.join(', ')}`,
    '',
    '## Problem',
    '',
    idea.problem.trim(),
    '',
    '## Solution',
    '',
    idea.solutionSketch.trim(),
    '',
    '## Why Ethereum',
    '',
    idea.whyEthereum.trim(),
    '',
    `Source: https://usecaselab.org/idea/${idea.id}`,
    '',
  ]
  return parts.join('\n')
}

interface IdeaPageProps {
  idea: IdeaEntry
  accentColor: string
  onBack: () => void
}

export default function IdeaPage({ idea, accentColor, onBack }: IdeaPageProps) {
  const [stolen, setStolen] = useState(false)

  useEscapeKey(true, onBack)

  const handleSteal = useCallback(() => {
    navigator.clipboard.writeText(ideaAsMarkdown(idea))
    setStolen(true)
    setTimeout(() => setStolen(false), 2000)
  }, [idea])

  const conf = getDomainConfig(idea.domains)

  return (
    <div className="w-full max-w-6xl px-4 sm:px-6 pt-3 sm:pt-4 pb-6 sm:pb-8">
      <button
        onClick={onBack}
        aria-label="Back"
        className="mb-3 sm:mb-4 inline-flex items-center justify-center px-3 py-2 rounded-lg bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Hero + content as one flex row: shape on the left, everything else
          (title and content sections) in the right column so they share the
          same left edge. Content is capped at max-w-3xl so the Why Ethereum
          block and the right-aligned Edit button don't sprawl wider than
          the body prose. */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
        <div className="hidden md:block w-48 aspect-square rounded-2xl overflow-hidden bg-gray-50/50 dark:bg-neutral-900/50 flex-shrink-0">
          <Shape2D shape={conf.shape} color={conf.color} seed={idea.id} autoRotate />
        </div>
        <div className="flex-1 min-w-0 w-full pt-1">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex flex-wrap gap-1.5">
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
            <button
              onClick={handleSteal}
              aria-label={stolen ? 'Copied' : 'Copy idea as markdown'}
              title={stolen ? 'Copied' : 'Copy idea as markdown'}
              className="flex-shrink-0 p-2 -mr-2 -mt-1 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors"
            >
              {stolen ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-black dark:text-white">
            {idea.title}
          </h1>

          <div className="mt-10 sm:mt-14 space-y-10 sm:space-y-14 max-w-3xl">
            {/* Problem */}
            {idea.problem && (
              <section>
                <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
                  Problem
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {renderMarkdownLinks(idea.problem)}
                </p>
              </section>
            )}

            {/* Solution Sketch */}
            {idea.solutionSketch && (
              <section>
                <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
                  Solution Sketch
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {renderMarkdownLinks(idea.solutionSketch)}
                </p>
              </section>
            )}

            {/* Why Ethereum */}
            {idea.whyEthereum && (
              <section>
                <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
                  Why Ethereum
                </h2>
                <div
                  className="p-5 sm:p-6 rounded-xl border border-gray-100 dark:border-gray-800"
                  style={{ backgroundColor: `${accentColor}14` }}
                >
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {renderMarkdownLinks(idea.whyEthereum)}
                  </p>
                </div>
              </section>
            )}

            {/* Footer: last-edited stamp on the left, Edit CTA on the right */}
            <section className="flex flex-wrap items-center gap-3 pt-2">
              {idea.updatedAt && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Last edited {formatDate(idea.updatedAt)}
                </span>
              )}
              <a
                href={editOnGithubUrl(idea.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-black dark:bg-neutral-950 dark:border-gray-800 dark:text-white text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                Edit
                <ExternalLink className="w-3 h-3 text-gray-400 dark:text-gray-500" />
              </a>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
