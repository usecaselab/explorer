import React, { useState, useCallback } from 'react'
import { ExternalLink, Check, Copy, Github, X } from 'lucide-react'
import { renderMarkdownLinks } from '../utils'
import Shape3D from './Shape3D'
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
}

function domainLabel(d: string): string {
  return d.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function editOnGithubUrl(id: string): string {
  return `https://github.com/${REPO}/edit/${BRANCH}/public/data/ideas/${id}.md`
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
    <div className="w-full max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
      {/* Close */}
      <div className="mb-8 sm:mb-12">
        <button
          onClick={onBack}
          aria-label="Close"
          className="-ml-2 p-2 text-gray-400 hover:text-black hover:bg-gray-50 dark:hover:text-white dark:hover:bg-neutral-900 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Hero + content as one flex row: shape on the left, everything else
          (title and content sections) in the right column so they share the
          same left edge. Content is capped at max-w-3xl so the Why Ethereum
          block and the right-aligned Edit button don't sprawl wider than
          the body prose. */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
        <div className="w-full md:w-48 aspect-square rounded-2xl overflow-hidden bg-gray-50/50 dark:bg-neutral-900/50 flex-shrink-0">
          <Shape3D shape={conf.shape} color={conf.color} />
        </div>
        <div className="flex-1 min-w-0 w-full pt-1">
          <div className="flex flex-wrap gap-1.5 mb-3">
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
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
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
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
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
                  {capability && (
                    <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3 ${badgeColors[capability]}`}>
                      {capability}
                    </span>
                  )}
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {renderMarkdownLinks(whyExplanation)}
                  </p>
                </div>
              </section>
            )}

            {/* Primary CTAs */}
            <section className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={handleSteal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                {stolen ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Steal this idea
                  </>
                )}
              </button>
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
