import React, { useState, useCallback } from 'react'
import { ArrowLeft, ArrowUpRight, GitBranch, GraduationCap, Users, Terminal, Palette, Copy, Check } from 'lucide-react'
import Shape3D from './Shape3D'

interface ToolkitPageProps {
  onBack: () => void
}

const TOOLS = [
  {
    title: 'Nexth',
    description: 'Full-stack Ethereum starter kit. Next.js, wagmi, viem, RainbowKit — everything wired up so you can start building immediately instead of configuring.',
    url: 'https://github.com/usecaselab/nexth',
    icon: GitBranch,
    color: '#2563EB',
    shape: 'box' as const,
    tags: ['Next.js', 'wagmi', 'viem', 'Starter Kit'],
    cta: 'View on GitHub',
  },
  {
    title: 'EthSkills',
    description: 'The missing knowledge between AI agents and production Ethereum. Solidity, DeFi protocols, ERC standards, L2s, Foundry — structured for both humans and AI.',
    url: 'https://ethskills.com/',
    icon: GraduationCap,
    color: '#7C3AED',
    shape: 'torusKnot' as const,
    tags: ['Solidity', 'DeFi', 'ERC Standards', 'Learning'],
    cta: 'Explore skills',
  },
  {
    title: 'Crops Design',
    description: 'Design studio for Ethereum projects. Brand identity, product design, and visual systems built by people who understand the ecosystem.',
    url: 'https://www.cropsdesign.com/',
    icon: Palette,
    color: '#F97316',
    shape: 'dodecahedron' as const,
    tags: ['Design', 'Branding', 'Product Design'],
    cta: 'Visit Crops',
  },
  {
    title: 'Use Case Lab Community',
    description: 'Connect with builders, researchers, and product thinkers advancing human-centered Ethereum adoption. Share ideas, find collaborators, get feedback on your project.',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLScuPwPvOyMrMeCuGs-lENYm3WlFXl3Pvu2eEJPqN61Kn1DCFg/viewform',
    icon: Users,
    color: '#059669',
    shape: 'sphere' as const,
    tags: ['Community', 'Collaboration', 'Support'],
    cta: 'Join the community',
  },
  {
    title: 'Explorer Skill',
    description: 'A Claude Code skill that gives AI deep knowledge of 122 Ethereum use cases. Search by keyword or domain, brainstorm product ideas, and research what\'s being built — all from your terminal.',
    url: '/explorer.skill',
    icon: Terminal,
    color: '#0891B2',
    shape: 'icosahedron' as const,
    tags: ['Claude Code', 'AI', 'Research'],
    cta: 'Download skill',
    installCmd: 'curl -sL usecaselab.org/skill.md',
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
      className="w-full flex items-center gap-2 bg-gray-100 text-gray-500 rounded-xl px-4 py-3 font-mono text-xs hover:bg-gray-200 transition-colors"
    >
      <span className="text-gray-400 select-none">$</span>
      <code className="flex-1 text-left truncate text-gray-600">{command}</code>
      {copied ? <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> : <Copy className="w-4 h-4 text-gray-400 flex-shrink-0" />}
    </button>
  )
}

export default function ToolkitPage({ onBack }: ToolkitPageProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors mb-8 sm:mb-12"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Hero */}
      <div className="mb-10 sm:mb-16">
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-black">
          Use Case Lab Toolkit
        </h1>
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-500 max-w-2xl leading-relaxed">
          Everything you need to go from idea to working Ethereum product. Starter code, knowledge, community, and AI-powered research.
        </p>
      </div>

      {/* Tool Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map(tool => {
          const Icon = tool.icon
          return (
            <div
              key={tool.title}
              className="flex flex-col rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 ease-out overflow-hidden group"
            >
              <div className="hidden sm:block aspect-[4/3] w-full bg-gray-50/50">
                <Shape3D shape={tool.shape} color={tool.color} />
              </div>
              <div className="p-4 sm:p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2.5 mb-2">
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: tool.color }} />
                  <h2 className="font-heading text-base font-bold text-black">
                    {tool.title}
                  </h2>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">
                  {tool.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tool.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${tool.color}15`, color: tool.color }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {'installCmd' in tool && tool.installCmd ? (
                  <InstallCommand command={tool.installCmd} />
                ) : (
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    {tool.cta} <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
