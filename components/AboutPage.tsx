import React from 'react'

const h2Class =
  'mt-14 sm:mt-16 font-heading text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white'
const bodyClass =
  'mt-4 text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed'
const ulClass =
  'mt-4 space-y-2 text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed list-disc pl-5'
const inlineCodeClass =
  'px-1.5 py-0.5 rounded bg-gray-100 dark:bg-neutral-900 text-[0.9em] font-mono text-gray-700 dark:text-gray-300'
const linkClass =
  'text-black dark:text-white underline decoration-gray-300 dark:decoration-gray-700 hover:decoration-current transition-colors'
const strongClass = 'font-semibold text-black dark:text-white'

export default function AboutPage() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-28">
      <article className="max-w-3xl">
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] text-black dark:text-white">
          About
        </h1>

        <p className="mt-8 sm:mt-10 text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Use Case Lab is a curated index of Ethereum use cases organized by
          the people they would benefit. Each entry is a short, opinionated
          sketch: a real problem, a solution, and the reason a centralized
          version would not serve the user as well.
        </p>

        <h2 id="for-agents" className={h2Class}>
          For agents
        </h2>
        <p className={bodyClass}>
          If you are an AI agent or LLM tool, start at{' '}
          <a href="/llms.txt" className={linkClass}>
            /llms.txt
          </a>
          . It is the top-level entry point: site summary plus links to the
          full dataset and structured surfaces.
        </p>
        <ul className={ulClass}>
          <li>
            <a href="/llms.txt" className={linkClass}>
              /llms.txt
            </a>
            : top-level entry point. Site summary plus links to the full
            dataset.
          </li>
          <li>
            <a href="/llms-full.txt" className={linkClass}>
              /llms-full.txt
            </a>
            : the full corpus inline as markdown (every idea and persona).
          </li>
          <li>
            <a href="/ideas.json" className={linkClass}>
              /ideas.json
            </a>{' '}
            and{' '}
            <a href="/personas.json" className={linkClass}>
              /personas.json
            </a>
            : the same content as JSON.
          </li>
        </ul>

        <h2 className={h2Class}>Contributing</h2>
        <p className={bodyClass}>
          Click <strong className={strongClass}>Submit</strong> in the sidebar
          to open a prefilled new-file form on GitHub. Write your idea, propose
          the file, a PR opens. We review and merge. To edit an existing entry,
          use the <strong className={strongClass}>Edit</strong> button at the
          bottom of any idea page.
        </p>
        <p className={bodyClass}>
          Idea files live in{' '}
          <code className={inlineCodeClass}>public/data/ideas/</code>; personas
          in <code className={inlineCodeClass}>public/data/personas/</code>.
          Format, persona-linking conventions, and review guidelines are in the{' '}
          <a
            href="https://github.com/usecaselab/explorer#readme"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            README
          </a>
          . Source:{' '}
          <a
            href="https://github.com/usecaselab/explorer"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            github.com/usecaselab/explorer
          </a>
          , MIT licensed.
        </p>
      </article>
    </section>
  )
}
