// Survives the OAuth round-trip in sessionStorage so that an action a
// logged-out user started before sign-in can be replayed on their return.

export interface SubmitIdeaDraft {
  title: string;
  problem: string;
  solution: string;
  why: string;
  domains: string[];
}

export interface EditIdeaDraft {
  title: string;
  problem: string;
  solution: string;
  why: string;
  domains: string[];
}

export type PendingAction =
  | { type: 'vote'; ideaId: string }
  | { type: 'working-on'; ideaId: string; url?: string; note?: string }
  | { type: 'submit-idea'; draft: SubmitIdeaDraft }
  | { type: 'edit-idea'; ideaId: string; draft: EditIdeaDraft };

const KEY = 'uce-pending-action';

export function setPending(action: PendingAction): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(action));
  } catch {
    // sessionStorage unavailable (private mode, quota) — degrade silently;
    // the user just won't auto-replay after sign-in
  }
}

export function consumePending(): PendingAction | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    return JSON.parse(raw) as PendingAction;
  } catch {
    return null;
  }
}
