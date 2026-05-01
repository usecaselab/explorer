import React, { useState, useCallback, useEffect } from 'react'
import { ArrowLeft, ArrowRight, ExternalLink, Link, Check, Wrench } from 'lucide-react'
import { renderMarkdownLinks } from '../utils'
import Shape3D from './Shape3D'
import { getDomainConfig, DOMAIN_CONFIG } from './IdeaShowcase'
import VoteButton from './VoteButton'
import WorkingOnButton from './WorkingOnButton'
import BuildersList from './BuildersList'
import EditIdeaModal from './EditIdeaModal'
import { fetchIdeaState } from '../lib/api'
import type { Builder } from '../lib/api'
import { useSession } from '../lib/auth-client'
import type { EditIdeaDraft } from '../lib/pending-action'

export interface IdeaEntry {
  id: string
  title: string
  problem: string
  solutionSketch: string
  whyEthereum: string
  domains: string[]
  author?: string
  createdAt?: number
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
  refreshNonce?: number
  pendingEdit?: EditIdeaDraft | null
  onPendingEditConsumed?: () => void
}

export default function IdeaPage({ idea, accentColor, onBack, allIdeas = [], onSelectIdea, refreshNonce = 0, pendingEdit, onPendingEditConsumed }: IdeaPageProps) {
  const [copied, setCopied] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editInitialDraft, setEditInitialDraft] = useState<EditIdeaDraft | null>(null)
  const [votes, setVotes] = useState(0)
  const [voted, setVoted] = useState(false)
  const [builders, setBuilders] = useState<Builder[]>([])
  const [myWorking, setMyWorking] = useState<Builder | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    let cancelled = false
    fetchIdeaState(idea.id)
      .then((s) => {
        if (cancelled) return
        setVotes(s.votes)
        setVoted(s.myVote)
        setBuilders(s.builders)
        setMyWorking(s.myWorking)
      })
      .catch(() => {
        // soft-fail; the page still renders without community state
      })
    return () => {
      cancelled = true
    }
  }, [idea.id, session?.user?.id, refreshNonce])

  // Replay an Improve-this-idea draft handed back after the OAuth round-trip.
  useEffect(() => {
    if (!pendingEdit) return
    setEditInitialDraft(pendingEdit)
    setEditOpen(true)
    onPendingEditConsumed?.()
  }, [pendingEdit, onPendingEditConsumed])

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  // Prev/next navigation through the current allIdeas list.
  const currentIdx = allIdeas.findIndex(i => i.id === idea.id)
  const prevIdea = currentIdx > 0 ? allIdeas[currentIdx - 1] : null
  const nextIdea = currentIdx >= 0 && currentIdx < allIdeas.length - 1 ? allIdeas[currentIdx + 1] : null

  useEffect(() => {
    if (!onSelectIdea) return
    const handler = (e: KeyboardEvent) => {
      // Ignore when user is typing in inputs/textareas/contentEditable.
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (e.key === 'ArrowLeft' && prevIdea) {
        e.preventDefault()
        onSelectIdea(prevIdea)
      } else if (e.key === 'ArrowRight' && nextIdea) {
        e.preventDefault()
        onSelectIdea(nextIdea)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onSelectIdea, prevIdea?.id, nextIdea?.id])

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
          {idea.author && (
            <p className="mt-2 text-sm text-gray-500">
              by <span className="text-gray-700 font-medium">{idea.author}</span>
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-5">
            <VoteButton
              ideaId={idea.id}
              votes={votes}
              voted={voted}
              onChange={(next) => {
                setVotes(next.votes)
                setVoted(next.voted)
              }}
            />
            <WorkingOnButton
              ideaId={idea.id}
              myWorking={myWorking}
              onChange={(next) => {
                setBuilders(next)
                const me = session?.user?.id
                  ? next.find((b) => b.userId === session.user.id) || null
                  : null
                setMyWorking(me)
              }}
            />
          </div>
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

        {/* Builders */}
        <BuildersList builders={builders} />

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
          </div>
        </section>

        {/* Prev / Next navigation */}
        {onSelectIdea && (prevIdea || nextIdea) && (
          <nav
            aria-label="Idea navigation"
            className="grid gap-3 sm:gap-4 grid-cols-2 pt-6 border-t border-gray-100"
          >
            {prevIdea ? (
              <a
                href={`/idea/${prevIdea.id}`}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
                  e.preventDefault()
                  onSelectIdea(prevIdea)
                }}
                className="group flex flex-col rounded-xl border border-gray-100 hover:border-gray-300 transition-colors p-4 sm:p-5 no-underline text-inherit"
              >
                <span className="text-xs uppercase tracking-widest text-gray-400 inline-flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> Previous
                </span>
                <span className="font-heading text-sm sm:text-base font-bold text-black leading-snug mt-2 line-clamp-2">
                  {prevIdea.title}
                </span>
              </a>
            ) : (
              <div />
            )}
            {nextIdea ? (
              <a
                href={`/idea/${nextIdea.id}`}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
                  e.preventDefault()
                  onSelectIdea(nextIdea)
                }}
                className="group flex flex-col items-end text-right rounded-xl border border-gray-100 hover:border-gray-300 transition-colors p-4 sm:p-5 no-underline text-inherit"
              >
                <span className="text-xs uppercase tracking-widest text-gray-400 inline-flex items-center gap-1">
                  Next <ArrowRight className="w-3 h-3" />
                </span>
                <span className="font-heading text-sm sm:text-base font-bold text-black leading-snug mt-2 line-clamp-2">
                  {nextIdea.title}
                </span>
              </a>
            ) : (
              <div />
            )}
          </nav>
        )}
      </div>

      <EditIdeaModal
        idea={idea}
        open={editOpen}
        onClose={() => {
          setEditOpen(false)
          setTimeout(() => setEditInitialDraft(null), 300)
        }}
        initialDraft={editInitialDraft}
      />
    </div>
  )
}
