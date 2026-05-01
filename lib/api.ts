export interface Builder {
  userId: string;
  name: string;
  image: string | null;
  url: string | null;
  note: string | null;
  socialUrl: string | null;
  createdAt: number;
}

export interface IdeaState {
  ideaId: string;
  votes: number;
  builders: Builder[];
  myVote: boolean;
  myWorking: Builder | null;
}

export interface IdeasBulkState {
  counts: Record<string, { votes: number; builders: number }>;
  myVotes: string[];
}

const json = { 'Content-Type': 'application/json' };

async function call(input: string, init?: RequestInit) {
  const res = await fetch(input, {
    credentials: 'include',
    ...init,
  });
  if (!res.ok && res.status !== 409) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res;
}

export async function fetchIdeasBulkState(): Promise<IdeasBulkState> {
  const res = await call('/api/ideas/state');
  return res.json();
}

export async function fetchIdeaState(ideaId: string): Promise<IdeaState> {
  const res = await call(`/api/ideas/${encodeURIComponent(ideaId)}/state`);
  return res.json();
}

export async function vote(ideaId: string) {
  const res = await call(`/api/ideas/${encodeURIComponent(ideaId)}/vote`, {
    method: 'POST',
  });
  if (res.status === 409) return { votes: 0, voted: true, alreadyVoted: true };
  return { ...(await res.json()), alreadyVoted: false };
}

export async function unvote(ideaId: string) {
  const res = await call(`/api/ideas/${encodeURIComponent(ideaId)}/vote`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function setWorking(
  ideaId: string,
  payload: { url?: string; note?: string }
) {
  const res = await call(`/api/ideas/${encodeURIComponent(ideaId)}/working`, {
    method: 'POST',
    headers: json,
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function unsetWorking(ideaId: string) {
  const res = await call(`/api/ideas/${encodeURIComponent(ideaId)}/working`, {
    method: 'DELETE',
  });
  return res.json();
}

export interface SubmissionDraft {
  title: string;
  problem: string;
  solutionSketch: string;
  whyEthereum: string;
  domains: string[];
}

export interface SubmissionRow {
  id: string;
  title: string;
  problem: string;
  solutionSketch: string;
  whyEthereum: string;
  domains: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedBy?: string;
  rejectionReason?: string | null;
  submitter?: { id: string; name: string; email: string };
  createdAt?: number;
  updatedAt?: number;
}

export async function submitIdea(draft: SubmissionDraft) {
  const res = await call('/api/submissions', {
    method: 'POST',
    headers: json,
    body: JSON.stringify(draft),
  });
  return res.json() as Promise<{ id: string; status: 'pending' }>;
}

export async function fetchMySubmissions(): Promise<SubmissionRow[]> {
  const res = await call('/api/submissions/mine');
  return res.json();
}

export async function fetchApprovedSubmissions(): Promise<SubmissionRow[]> {
  const res = await call('/api/submissions/approved');
  return res.json();
}

export interface IdeaRow {
  id: string;
  title: string;
  problem: string;
  solutionSketch: string;
  whyEthereum: string;
  domains: string[];
  author: string;
  createdAt: number;
}

export async function fetchAllIdeas(): Promise<IdeaRow[]> {
  const res = await call('/api/ideas');
  return res.json();
}

export async function fetchPendingSubmissions(): Promise<SubmissionRow[]> {
  const res = await call('/api/admin/submissions');
  return res.json();
}

export async function approveSubmission(id: string) {
  const res = await call(`/api/admin/submissions/${encodeURIComponent(id)}/approve`, {
    method: 'POST',
  });
  return res.json();
}

export async function rejectSubmission(id: string, reason: string) {
  const res = await call(`/api/admin/submissions/${encodeURIComponent(id)}/reject`, {
    method: 'POST',
    headers: json,
    body: JSON.stringify({ reason }),
  });
  return res.json();
}

export async function fetchIsAdmin(): Promise<boolean> {
  const res = await call('/api/admin/me');
  const data = await res.json();
  return !!data.isAdmin;
}

export async function fetchRejectedSubmissions(): Promise<SubmissionRow[]> {
  const res = await call('/api/admin/submissions/rejected');
  return res.json();
}

export async function restoreSubmission(id: string) {
  const res = await call(`/api/admin/submissions/${encodeURIComponent(id)}/restore`, {
    method: 'POST',
  });
  return res.json();
}

// --- Edits ---
export interface EditDraft {
  ideaId: string;
  title?: string;
  problem?: string;
  solutionSketch?: string;
  whyEthereum?: string;
  domains?: string[];
}

export interface EditRow {
  id: string;
  ideaId: string;
  title: string | null;
  problem: string | null;
  solutionSketch: string | null;
  whyEthereum: string | null;
  domains: string[] | null;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason: string | null;
  submitter: { id: string; name: string; email: string };
  createdAt: number;
  updatedAt: number;
}

export interface IdeaOverride {
  ideaId: string;
  title?: string | null;
  problem?: string | null;
  solutionSketch?: string | null;
  whyEthereum?: string | null;
  domains?: string[];
}

export async function submitEdit(draft: EditDraft) {
  const res = await call('/api/edits', {
    method: 'POST',
    headers: json,
    body: JSON.stringify(draft),
  });
  return res.json() as Promise<{ id: string; status: 'pending' }>;
}

export async function fetchOverrides(): Promise<Record<string, IdeaOverride>> {
  const res = await call('/api/edits/overrides');
  return res.json();
}

export async function fetchPendingEdits(): Promise<EditRow[]> {
  const res = await call('/api/admin/edits');
  return res.json();
}

export async function fetchRejectedEdits(): Promise<EditRow[]> {
  const res = await call('/api/admin/edits/rejected');
  return res.json();
}

export async function approveEdit(id: string) {
  const res = await call(`/api/admin/edits/${encodeURIComponent(id)}/approve`, {
    method: 'POST',
  });
  return res.json();
}

export async function rejectEdit(id: string, reason: string) {
  const res = await call(`/api/admin/edits/${encodeURIComponent(id)}/reject`, {
    method: 'POST',
    headers: json,
    body: JSON.stringify({ reason }),
  });
  return res.json();
}

export async function restoreEdit(id: string) {
  const res = await call(`/api/admin/edits/${encodeURIComponent(id)}/restore`, {
    method: 'POST',
  });
  return res.json();
}
