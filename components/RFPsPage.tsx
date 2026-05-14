import React from 'react'
import Shape3D from './Shape3D'
import { RFPS, type RFP } from '../lib/rfps'

interface RFPsPageProps {
  onSelect: (rfp: RFP) => void
}

export default function RFPsPage({ onSelect }: RFPsPageProps) {
  return (
    <section className="w-full max-w-6xl px-4 sm:px-6 pt-4 sm:pt-6 pb-8 sm:pb-12 md:pb-16">
      {/* Hero */}
      <div className="mb-8 sm:mb-12">
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
          Requests<br />
          <span className="text-gray-400 dark:text-gray-600">for proposals</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
          Open invitations for serious inquiry into new real-world domains.
        </p>
      </div>

      {/* Cards: 2-col grid with wireframe shape, title, and subtext. */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        {RFPS.map((rfp) => (
          <a
            key={rfp.id}
            href={`/rfp/${rfp.id}`}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
              e.preventDefault()
              onSelect(rfp)
            }}
            className="group relative rounded-2xl border border-gray-100 dark:border-gray-900 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md transition-all duration-300 overflow-hidden no-underline text-inherit flex flex-col"
            style={{ backgroundColor: `${rfp.color}0a` }}
          >
            <div className="aspect-[16/9] w-full bg-gray-50/30 dark:bg-neutral-900/30">
              <Shape3D shape={rfp.shape} color={rfp.color} />
            </div>
            <div className="p-5 sm:p-6">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-black dark:text-white leading-snug mb-3">
                {rfp.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{rfp.tagline}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
