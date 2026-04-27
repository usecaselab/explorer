export interface Builder {
  userId: string;
  name: string;
  image: string | null;
  url: string | null;
  note: string | null;
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
