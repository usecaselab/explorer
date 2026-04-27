import React, { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Check, X, RotateCcw, Loader2 } from 'lucide-react';
import { useSession } from '../lib/auth-client';
import {
  fetchIsAdmin,
  fetchPendingSubmissions,
  fetchRejectedSubmissions,
  approveSubmission,
  rejectSubmission,
  restoreSubmission,
  fetchPendingEdits,
  fetchRejectedEdits,
  approveEdit,
  rejectEdit,
  restoreEdit,
  type SubmissionRow,
  type EditRow,
} from '../lib/api';
import { DOMAIN_CONFIG } from './IdeaShowcase';

interface AdminPageProps {
  onBack: () => void;
}

type Tab = 'pending-subs' | 'pending-edits' | 'rejected';

export default function AdminPage({ onBack }: AdminPageProps) {
  const { data: session, isPending: sessionLoading } = useSession();
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>('pending-subs');
  const [pendingSubs, setPendingSubs] = useState<SubmissionRow[]>([]);
  const [rejectedSubs, setRejectedSubs] = useState<SubmissionRow[]>([]);
  const [pendingEdits, setPendingEdits] = useState<EditRow[]>([]);
  const [rejectedEdits, setRejectedEdits] = useState<EditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const isA = await fetchIsAdmin();
      setAdmin(isA);
      if (isA) {
        const [a, b, c, d] = await Promise.all([
          fetchPendingSubmissions(),
          fetchRejectedSubmissions(),
          fetchPendingEdits(),
          fetchRejectedEdits(),
        ]);
        setPendingSubs(a);
        setRejectedSubs(b);
        setPendingEdits(c);
        setRejectedEdits(d);
      }
    } catch {
      setAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!sessionLoading) refresh();
  }, [sessionLoading, session?.user?.id, refresh]);

  // Non-admin users get bounced home — no surface area for randoms
  useEffect(() => {
    if (!sessionLoading && admin === false) {
      onBack();
    }
  }, [sessionLoading, admin, onBack]);

  const wrap = async <T,>(id: string, fn: () => Promise<T>): Promise<T | null> => {
    if (busyId) return null;
    setBusyId(id);
    try {
      return await fn();
    } catch (err: any) {
      alert(err.message || 'Action failed');
      return null;
    } finally {
      setBusyId(null);
    }
  };

  const handleApproveSub = (id: string) =>
    wrap(id, async () => {
      await approveSubmission(id);
      setPendingSubs((p) => p.filter((s) => s.id !== id));
    });
  const handleRejectSub = (id: string) =>
    wrap(id, async () => {
      const reason = window.prompt('Reason for rejection (optional)') || '';
      await rejectSubmission(id, reason);
      const moved = pendingSubs.find((s) => s.id === id);
      setPendingSubs((p) => p.filter((s) => s.id !== id));
      if (moved) setRejectedSubs((r) => [{ ...moved, status: 'rejected', rejectionReason: reason }, ...r]);
    });
  const handleRestoreSub = (id: string) =>
    wrap(id, async () => {
      await restoreSubmission(id);
      const moved = rejectedSubs.find((s) => s.id === id);
      setRejectedSubs((r) => r.filter((s) => s.id !== id));
      if (moved) setPendingSubs((p) => [...p, { ...moved, status: 'pending', rejectionReason: null }]);
    });

  const handleApproveEdit = (id: string) =>
    wrap(id, async () => {
      await approveEdit(id);
      setPendingEdits((p) => p.filter((e) => e.id !== id));
    });
  const handleRejectEdit = (id: string) =>
    wrap(id, async () => {
      const reason = window.prompt('Reason for rejection (optional)') || '';
      await rejectEdit(id, reason);
      const moved = pendingEdits.find((e) => e.id === id);
      setPendingEdits((p) => p.filter((e) => e.id !== id));
      if (moved) setRejectedEdits((r) => [{ ...moved, status: 'rejected', rejectionReason: reason }, ...r]);
    });
  const handleRestoreEdit = (id: string) =>
    wrap(id, async () => {
      await restoreEdit(id);
      const moved = rejectedEdits.find((e) => e.id === id);
      setRejectedEdits((r) => r.filter((e) => e.id !== id));
      if (moved) setPendingEdits((p) => [...p, { ...moved, status: 'pending', rejectionReason: null }]);
    });

  if (sessionLoading || loading || admin === null) {
    return (
      <div className="flex-1 flex items-center justify-center py-32">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }
  if (!admin) return null; // useEffect already redirects

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'pending-subs', label: 'Pending submissions', count: pendingSubs.length },
    { id: 'pending-edits', label: 'Pending edits', count: pendingEdits.length },
    { id: 'rejected', label: 'Rejected', count: rejectedSubs.length + rejectedEdits.length },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-black"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="font-heading text-lg font-bold text-black">Admin</h1>
      </div>

      <div className="flex gap-1 mb-6 border-b border-gray-100">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                active
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              {t.label}{' '}
              <span className="text-xs text-gray-400 ml-1">{t.count}</span>
            </button>
          );
        })}
      </div>

      {tab === 'pending-subs' && (
        <SubmissionList
          items={pendingSubs}
          mode="pending"
          busyId={busyId}
          onApprove={handleApproveSub}
          onReject={handleRejectSub}
        />
      )}
      {tab === 'pending-edits' && (
        <EditList
          items={pendingEdits}
          mode="pending"
          busyId={busyId}
          onApprove={handleApproveEdit}
          onReject={handleRejectEdit}
        />
      )}
      {tab === 'rejected' && (
        <div className="space-y-8">
          {rejectedSubs.length > 0 && (
            <div>
              <h2 className="font-heading text-xs uppercase tracking-widest text-gray-400 mb-3">
                Rejected submissions
              </h2>
              <SubmissionList
                items={rejectedSubs}
                mode="rejected"
                busyId={busyId}
                onRestore={handleRestoreSub}
              />
            </div>
          )}
          {rejectedEdits.length > 0 && (
            <div>
              <h2 className="font-heading text-xs uppercase tracking-widest text-gray-400 mb-3">
                Rejected edits
              </h2>
              <EditList
                items={rejectedEdits}
                mode="rejected"
                busyId={busyId}
                onRestore={handleRestoreEdit}
              />
            </div>
          )}
          {rejectedSubs.length === 0 && rejectedEdits.length === 0 && (
            <p className="text-center text-gray-400 py-12">Nothing rejected yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

function DomainPills({ ids }: { ids: string[] }) {
  return (
    <div className="flex flex-wrap gap-1 mb-3">
      {ids.map((d) => {
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

function SubmissionList({
  items,
  mode,
  busyId,
  onApprove,
  onReject,
  onRestore,
}: {
  items: SubmissionRow[];
  mode: 'pending' | 'rejected';
  busyId: string | null;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onRestore?: (id: string) => void;
}) {
  if (!items.length) {
    return <p className="text-center text-gray-400 py-12">No items.</p>;
  }
  return (
    <div className="space-y-4">
      {items.map((s) => (
        <div key={s.id} className="rounded-xl border border-gray-100 p-5 bg-white">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-lg font-bold text-black">
                {s.title}
              </h3>
              <div className="text-xs text-gray-500 mt-1">
                by {s.submitter?.name || s.submitter?.email || 'unknown'}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {mode === 'pending' && onApprove && onReject && (
                <>
                  <button
                    onClick={() => onApprove(s.id)}
                    disabled={!!busyId}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => onReject(s.id)}
                    disabled={!!busyId}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </>
              )}
              {mode === 'rejected' && onRestore && (
                <button
                  onClick={() => onRestore(s.id)}
                  disabled={!!busyId}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Restore
                </button>
              )}
            </div>
          </div>
          <DomainPills ids={s.domains} />
          {mode === 'rejected' && s.rejectionReason && (
            <div className="mb-3 p-3 rounded-lg bg-red-50 text-red-700 text-xs">
              <span className="font-bold">Reason:</span> {s.rejectionReason}
            </div>
          )}
          <Section label="Problem">{s.problem}</Section>
          <Section label="Solution">{s.solutionSketch}</Section>
          <Section label="Why Ethereum">{s.whyEthereum}</Section>
        </div>
      ))}
    </div>
  );
}

function EditList({
  items,
  mode,
  busyId,
  onApprove,
  onReject,
  onRestore,
}: {
  items: EditRow[];
  mode: 'pending' | 'rejected';
  busyId: string | null;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onRestore?: (id: string) => void;
}) {
  if (!items.length) {
    return <p className="text-center text-gray-400 py-12">No items.</p>;
  }
  return (
    <div className="space-y-4">
      {items.map((e) => (
        <div key={e.id} className="rounded-xl border border-gray-100 p-5 bg-white">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-base font-bold text-black">
                Edit on{' '}
                <a
                  href={`/idea/${e.ideaId}`}
                  className="underline decoration-gray-300 hover:decoration-black"
                >
                  {e.ideaId}
                </a>
              </h3>
              <div className="text-xs text-gray-500 mt-1">
                by {e.submitter?.name || e.submitter?.email || 'unknown'}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {mode === 'pending' && onApprove && onReject && (
                <>
                  <button
                    onClick={() => onApprove(e.id)}
                    disabled={!!busyId}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => onReject(e.id)}
                    disabled={!!busyId}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </>
              )}
              {mode === 'rejected' && onRestore && (
                <button
                  onClick={() => onRestore(e.id)}
                  disabled={!!busyId}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Restore
                </button>
              )}
            </div>
          </div>
          {e.domains && <DomainPills ids={e.domains} />}
          {mode === 'rejected' && e.rejectionReason && (
            <div className="mb-3 p-3 rounded-lg bg-red-50 text-red-700 text-xs">
              <span className="font-bold">Reason:</span> {e.rejectionReason}
            </div>
          )}
          {e.title && <Section label="New title">{e.title}</Section>}
          {e.problem && <Section label="New problem">{e.problem}</Section>}
          {e.solutionSketch && <Section label="New solution">{e.solutionSketch}</Section>}
          {e.whyEthereum && <Section label="New why-Ethereum">{e.whyEthereum}</Section>}
        </div>
      ))}
    </div>
  );
}
