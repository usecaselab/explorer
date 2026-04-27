import React, { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Check, X, ShieldAlert, Loader2 } from 'lucide-react';
import { useSession } from '../lib/auth-client';
import {
  fetchIsAdmin,
  fetchPendingSubmissions,
  approveSubmission,
  rejectSubmission,
  type SubmissionRow,
} from '../lib/api';
import { DOMAIN_CONFIG } from './IdeaShowcase';

interface AdminPageProps {
  onBack: () => void;
}

export default function AdminPage({ onBack }: AdminPageProps) {
  const { data: session, isPending: sessionLoading } = useSession();
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [items, setItems] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const isA = await fetchIsAdmin();
      setAdmin(isA);
      if (isA) setItems(await fetchPendingSubmissions());
    } catch {
      setAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!sessionLoading) refresh();
  }, [sessionLoading, session?.user?.id, refresh]);

  const handleApprove = async (id: string) => {
    if (busyId) return;
    setBusyId(id);
    try {
      await approveSubmission(id);
      setItems((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err.message || 'Approve failed');
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (busyId) return;
    const reason = window.prompt('Why is this rejected? (optional)') || '';
    setBusyId(id);
    try {
      await rejectSubmission(id, reason);
      setItems((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err.message || 'Reject failed');
    } finally {
      setBusyId(null);
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-20 text-center">
        <ShieldAlert className="w-10 h-10 text-gray-300 mx-auto mb-4" />
        <h1 className="font-heading text-xl font-bold text-black mb-2">
          Not authorized
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          You're not on the admin allowlist.
        </p>
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-black inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-black"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="font-heading text-lg font-bold text-black">
          Admin · {items.length} pending
        </h1>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-400 py-20">
          Nothing in the queue.
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-gray-100 p-5 bg-white"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <h2 className="font-heading text-lg font-bold text-black">
                    {s.title}
                  </h2>
                  <div className="text-xs text-gray-500 mt-1">
                    by {s.submitter?.name || s.submitter?.email || 'unknown'}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleApprove(s.id)}
                    disabled={!!busyId}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(s.id)}
                    disabled={!!busyId}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {s.domains.map((d) => {
                  const dc = DOMAIN_CONFIG[d];
                  return (
                    <span
                      key={d}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${dc?.color || '#666'}15`,
                        color: dc?.color || '#666',
                      }}
                    >
                      {dc?.label || d}
                    </span>
                  );
                })}
              </div>

              <Section label="Problem">{s.problem}</Section>
              <Section label="Solution">{s.solutionSketch}</Section>
              <Section label="Why Ethereum">{s.whyEthereum}</Section>
              {s.resources?.length > 0 && (
                <Section label="Resources">
                  <ul className="space-y-0.5">
                    {s.resources.map((r, i) => (
                      <li key={i}>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {r.name || r.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2 last:mb-0">
      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
        {label}
      </div>
      <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
    </div>
  );
}
