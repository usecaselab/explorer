import React from 'react'
import { ChevronLeft } from 'lucide-react'
import Shape3D from './Shape3D'
import { useEscapeKey } from '../lib/useEscapeKey'
import type { RFP } from '../lib/rfps'

interface RFPPageProps {
  rfp: RFP
  onBack: () => void
}

export default function RFPPage({ rfp, onBack }: RFPPageProps) {
  useEscapeKey(true, onBack)

  return (
    <div className="relative w-full max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
      {/* Back: above the hero on mobile (no sidebar margin to use); absolute
          into the left margin between sidebar and content on md+. */}
      <button
        onClick={onBack}
        aria-label="Back"
        className="mb-6 md:mb-0 md:absolute md:top-8 md:-left-4 lg:-left-12 inline-flex items-center justify-center px-3 py-2 rounded-lg bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Hero */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start mb-12 sm:mb-16">
        <div
          className="hidden md:block w-56 aspect-square rounded-2xl overflow-hidden flex-shrink-0"
          style={{ backgroundColor: `${rfp.color}14` }}
        >
          <Shape3D shape={rfp.shape} color={rfp.color} />
        </div>
        <div className="flex-1 pt-1">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: rfp.color }}
          >
            RFP
          </span>
          <h1 className="mt-2 font-heading text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-black dark:text-white">
            {rfp.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
            {rfp.tagline}
          </p>
        </div>
      </div>

      {/* Placeholder body */}
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-neutral-900/50 p-8 sm:p-12 text-center">
        <p className="text-sm text-gray-400 dark:text-gray-500 font-medium uppercase tracking-widest mb-3">Coming soon</p>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-black dark:text-white mb-3">
          Full RFP content lands here
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
          Problem framing, the questions we're asking, criteria for proposals, and how to get in touch.
        </p>
      </div>
    </div>
  )
}
