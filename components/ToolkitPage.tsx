import React, { useState, useCallback } from 'react'
import { ArrowUpRight, GitBranch, GraduationCap, Terminal, Palette, Copy, Check } from 'lucide-react'

const TOOLS = [
  {
    title: 'Usecase Skill',
    description: 'A Claude Code skill that grounds your work in the Use Case Lab — ~120 curated Ethereum use cases across 16 domains. Ask Claude what\'s been tried in a domain, find adjacent work to your idea, or check whether your framing overlaps with what already exists.',
    url: '/usecase.md',
    icon: Terminal,
    color: '#0891B2',
    tags: ['Claude Code', 'Research', 'Grounding'],
    cta: 'Download skill',
    installCmd: 'curl -sL usecaselab.org/usecase.md',
  },
  {
    title: 'Crops Design',
    description: 'Design studio for Ethereum projects. Brand identity, product design, and visual systems built by people who understand the ecosystem.',
    url: 'https://www.cropsdesign.com/',
    icon: Palette,
    color: '#F97316',
    tags: ['Design', 'Branding', 'Product Design'],
    cta: 'Visit Crops',
    author: { handle: '@sodofi_', url: 'https://x.com/sodofi_' },
  },
  {
    title: 'EthSkills',
    description: 'The missing knowledge between AI agents and production Ethereum. Solidity, DeFi protocols, ERC standards, L2s, Foundry — structured for both humans and AI.',
    url: 'https://ethskills.com/',
    icon: GraduationCap,
    color: '#7C3AED',
    tags: ['Solidity', 'DeFi', 'ERC Standards', 'Learning'],
    cta: 'Explore skills',
    author: { handle: '@austingriffith', url: 'https://x.com/austingriffith' },
  },
  {
    title: 'Nexth',
    description: 'Full-stack Ethereum starter kit. Next.js, wagmi, viem, RainbowKit — everything wired up so you can start building immediately instead of configuring.',
    url: 'https://github.com/wslyvh/nexth',
    icon: GitBranch,
    color: '#2563EB',
    tags: ['Next.js', 'wagmi', 'viem', 'Starter Kit'],
    cta: 'View on GitHub',
    author: { handle: '@wslyvh', url: 'https://x.com/wslyvh' },
  },
]

function InstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [command])

  return (
    <button
      onClick={handleCopy}
      className="w-full flex items-center gap-2 bg-gray-50 text-gray-500 dark:bg-neutral-900 dark:text-gray-400 rounded-lg px-3 py-2 font-mono text-xs hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors border border-gray-100 dark:border-gray-800"
    >
      <span className="text-gray-400 dark:text-gray-500 select-none">$</span>
      <code className="flex-1 text-left truncate text-gray-600 dark:text-gray-300">{command}</code>
      {copied ? <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> : <Copy className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />}
    </button>
  )
}

export default function ToolkitPage() {
  return (
    <section className="w-full max-w-6xl px-4 sm:px-6 pt-4 sm:pt-6 pb-8 sm:pb-12 md:pb-16">
      {/* Hero — same shape as RFPs */}
      <div className="mb-8 sm:mb-12">
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
          Toolkit<br />
          <span className="text-gray-400 dark:text-gray-600">to ship ideas</span>
        </h1>
      </div>

      {/* Tool rows — icon-led horizontal cards, distinct from idea grids and RFP wireframes */}
      <div className="flex flex-col gap-3 sm:gap-4">
        {TOOLS.map((tool) => {
          const Icon = tool.icon
          const isExternal = tool.url.startsWith('http')
          const hasInstall = 'installCmd' in tool && Boolean(tool.installCmd)
          // If the tool has an install command, the whole card is informational —
          // only the InstallCommand button itself is clickable.
          const cardClass = hasInstall
            ? 'flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-2xl border border-gray-100 dark:border-gray-900 p-5 sm:p-6'
            : 'group flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-2xl border border-gray-100 dark:border-gray-900 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-neutral-900/50 transition-all p-5 sm:p-6 no-underline text-inherit'

          const Inner = (
            <>
              {/* Icon badge */}
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${tool.color}12`, color: tool.color }}
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-black dark:text-white leading-tight">
                    {tool.title}
                  </h2>
                  {!hasInstall && (
                    <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-black dark:group-hover:text-white transition-colors flex-shrink-0" />
                  )}
                </div>
                {'author' in tool && tool.author && (
                  <div className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                    by{' '}
                    <span
                      role="link"
                      tabIndex={0}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        window.open(tool.author!.url, '_blank', 'noopener,noreferrer')
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          e.stopPropagation()
                          window.open(tool.author!.url, '_blank', 'noopener,noreferrer')
                        }
                      }}
                      className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white cursor-pointer underline-offset-2 hover:underline"
                    >
                      {tool.author.handle}
                    </span>
                  </div>
                )}
                <p className="text-sm sm:text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                  {tool.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-neutral-900 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {hasInstall && <InstallCommand command={tool.installCmd!} />}
              </div>
            </>
          )

          if (hasInstall) {
            return (
              <div key={tool.title} className={cardClass}>
                {Inner}
              </div>
            )
          }

          return (
            <a
              key={tool.title}
              href={tool.url}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className={cardClass}
            >
              {Inner}
            </a>
          )
        })}
      </div>
    </section>
  )
}
