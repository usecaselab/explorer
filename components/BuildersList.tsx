import React from 'react';
import { ExternalLink, Hammer } from 'lucide-react';
import type { Builder } from '../lib/api';

interface BuildersListProps {
  builders: Builder[];
}

export default function BuildersList({ builders }: BuildersListProps) {
  if (!builders.length) return null;

  return (
    <section>
      <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
        <Hammer className="w-4 h-4 text-gray-500" />
        {builders.length === 1 ? 'Someone is building this' : `${builders.length} people building this`}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {builders.map((b) => {
          const inner = (
            <>
              <div className="flex items-center gap-3">
                {b.image ? (
                  <img
                    src={b.image}
                    alt={b.name}
                    className="w-9 h-9 rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {(b.name || '?').slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-black truncate">
                    {b.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {timeAgo(b.createdAt)}
                  </div>
                </div>
                {b.url && (
                  <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-black transition-colors flex-shrink-0" />
                )}
              </div>
              {b.note && (
                <p className="text-sm text-gray-600 leading-relaxed mt-2.5">
                  {b.note}
                </p>
              )}
            </>
          );
          return b.url ? (
            <a
              key={b.userId}
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors"
            >
              {inner}
            </a>
          ) : (
            <div
              key={b.userId}
              className="group p-4 rounded-xl border border-gray-100"
            >
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  return `${mo}mo ago`;
}
