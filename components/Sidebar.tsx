import React from 'react'
import { Lightbulb, FileText, Wrench, Mail } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export type RouteName = 'home' | 'rfps' | 'rfp' | 'idea' | 'toolkit'

interface SidebarProps {
  current: RouteName
  onNavigateHome: () => void
  onNavigateRFPs: () => void
  onNavigateToolkit: () => void
}

const CONTACT_URL = 'https://forms.gle/7Mrh3ZSL1scRw15j7'

export default function Sidebar({ current, onNavigateHome, onNavigateRFPs, onNavigateToolkit }: SidebarProps) {
  const items: {
    label: string
    icon: React.ComponentType<{ className?: string }>
    active: boolean
    onClick?: () => void
    href?: string
  }[] = [
    {
      label: 'Ideas',
      icon: Lightbulb,
      active: current === 'home' || current === 'idea',
      onClick: onNavigateHome,
    },
    {
      label: 'RFPs',
      icon: FileText,
      active: current === 'rfps' || current === 'rfp',
      onClick: onNavigateRFPs,
    },
    {
      label: 'Toolkit',
      icon: Wrench,
      active: current === 'toolkit',
      onClick: onNavigateToolkit,
    },
    {
      label: 'Contact',
      icon: Mail,
      active: false,
      href: CONTACT_URL,
    },
  ]

  return (
    <aside className="hidden md:flex md:w-56 lg:w-64 flex-shrink-0 flex-col gap-8 px-4 lg:px-6 py-6 sm:py-8 border-r border-gray-100 dark:border-gray-900 sticky top-0 self-start h-screen">
      <button onClick={onNavigateHome} className="hover:opacity-70 transition-opacity self-start">
        <img src="/initiative.svg" alt="Use Case Lab" className="h-7 dark:invert" />
      </button>

      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const Icon = item.icon
          const cls = `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            item.active
              ? 'bg-gray-100 text-black dark:bg-gray-900 dark:text-white'
              : 'text-gray-500 hover:text-black hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-900'
          }`
          return item.href ? (
            <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
              <Icon className="w-4 h-4" />
              {item.label}
            </a>
          ) : (
            <button key={item.label} onClick={item.onClick} className={`${cls} text-left`}>
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto">
        <ThemeToggle className="p-2 -ml-2" />
      </div>
    </aside>
  )
}
