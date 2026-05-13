import React, { useEffect } from 'react'
import { X, Lightbulb, FileText, Wrench, Mail } from 'lucide-react'
import type { RouteName } from './Sidebar'
import ThemeToggle from './ThemeToggle'

const CONTACT_URL = 'https://forms.gle/7Mrh3ZSL1scRw15j7'

interface MobileNavProps {
  open: boolean
  current: RouteName
  onClose: () => void
  onNavigateHome: () => void
  onNavigateRFPs: () => void
  onNavigateToolkit: () => void
}

export default function MobileNav({
  open,
  current,
  onClose,
  onNavigateHome,
  onNavigateRFPs,
  onNavigateToolkit,
}: MobileNavProps) {
  // Lock body scroll and bind Escape while open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  const handle = (fn: () => void) => () => {
    fn()
    onClose()
  }

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
      onClick: handle(onNavigateHome),
    },
    {
      label: 'RFPs',
      icon: FileText,
      active: current === 'rfps' || current === 'rfp',
      onClick: handle(onNavigateRFPs),
    },
    {
      label: 'Toolkit',
      icon: Wrench,
      active: current === 'toolkit',
      onClick: handle(onNavigateToolkit),
    },
    {
      label: 'Contact',
      icon: Mail,
      active: false,
      href: CONTACT_URL,
    },
  ]

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
      <div className="absolute inset-0 bg-black/30 dark:bg-black/60" onClick={onClose} />
      <aside className="absolute top-0 right-0 bottom-0 w-72 max-w-[85vw] bg-white dark:bg-neutral-950 shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-5 pt-5">
          <button onClick={onClose} aria-label="Close menu" className="-ml-1 p-2 text-gray-400 hover:text-black dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <button onClick={handle(onNavigateHome)} className="hover:opacity-70 transition-opacity">
            <img src="/initiative.svg" alt="Use Case Lab" className="h-6 dark:invert" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-3 mt-8">
          {items.map((item) => {
            const Icon = item.icon
            const cls = `flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
              item.active
                ? 'bg-gray-100 text-black dark:bg-gray-900 dark:text-white'
                : 'text-gray-600 hover:text-black hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-900'
            }`
            return item.href ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className={cls}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </a>
            ) : (
              <button key={item.label} onClick={item.onClick} className={`${cls} text-left`}>
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            )
          })}
        </nav>
        <div className="mt-auto px-5 pb-6">
          <ThemeToggle className="p-2 -ml-2" />
        </div>
      </aside>
    </div>
  )
}
