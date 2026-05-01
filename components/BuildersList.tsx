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
          const Avatar = b.image ? (
            <img src={b.image} alt={b.name} className="w-9 h-9 rounded-full flex-shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
              {(b.name || '?').slice(0, 1).toUpperCase()}
            </div>
          );

          const NameAndAvatar = b.socialUrl ? (
            <a
              href={b.socialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 min-w-0 flex-1 group/name"
              onClick={(e) => e.stopPropagation()}
            >
              {Avatar}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-black truncate group-hover/name:underline">
                  {b.name}
                </div>
                <div className="text-xs text-gray-500">{timeAgo(b.createdAt)}</div>
              </div>
            </a>
          ) : (
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {Avatar}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-black truncate">{b.name}</div>
                <div className="text-xs text-gray-500">{timeAgo(b.createdAt)}</div>
              </div>
            </div>
          );

          return (
            <div
              key={b.userId}
              className="group p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                {NameAndAvatar}
                {b.url && (
                  <a
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-black inline-flex items-center gap-1 flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Work
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              {b.note && (
                <p className="text-sm text-gray-600 leading-relaxed mt-2.5">{b.note}</p>
              )}
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
