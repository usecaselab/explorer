import { Router } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { db } from '../db.js';
import { auth } from '../auth.js';

const router = Router();

const insertVote = db.prepare(
  `INSERT INTO votes (ideaId, userId, createdAt) VALUES (?, ?, ?)`
);
const deleteVote = db.prepare(
  `DELETE FROM votes WHERE ideaId = ? AND userId = ?`
);
const upsertWorking = db.prepare(
  `INSERT INTO working (ideaId, userId, url, note, createdAt)
   VALUES (?, ?, ?, ?, ?)
   ON CONFLICT(ideaId, userId) DO UPDATE SET url = excluded.url, note = excluded.note`
);
const deleteWorking = db.prepare(
  `DELETE FROM working WHERE ideaId = ? AND userId = ?`
);

const voteCountsAll = db.prepare(
  `SELECT ideaId, COUNT(*) AS count FROM votes GROUP BY ideaId`
);
const myVotesAll = db.prepare(
  `SELECT ideaId FROM votes WHERE userId = ?`
);
const buildersByIdea = db.prepare(
  `SELECT w.ideaId, w.userId, w.url, w.note, w.createdAt, u.name, u.image, u.email,
          (SELECT a.providerId FROM account a WHERE a.userId = u.id ORDER BY a.createdAt ASC LIMIT 1) AS providerId
   FROM working w JOIN user u ON u.id = w.userId
   ORDER BY w.createdAt DESC`
);
const buildersForIdea = db.prepare(
  `SELECT w.userId, w.url, w.note, w.createdAt, u.name, u.image, u.email,
          (SELECT a.providerId FROM account a WHERE a.userId = u.id ORDER BY a.createdAt ASC LIMIT 1) AS providerId
   FROM working w JOIN user u ON u.id = w.userId
   WHERE w.ideaId = ?
   ORDER BY w.createdAt DESC`
);
const voteCountForIdea = db.prepare(
  `SELECT COUNT(*) AS count FROM votes WHERE ideaId = ?`
);
const hasMyVote = db.prepare(
  `SELECT 1 FROM votes WHERE ideaId = ? AND userId = ?`
);

async function getUser(req) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return session?.user ?? null;
}

function requireUser(handler) {
  return async (req, res, next) => {
    try {
      const user = await getUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthenticated' });
      req.user = user;
      return handler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

function deriveSocialUrl(providerId, name) {
  if (!name || /\s/.test(name)) return null;
  if (providerId === 'github') return `https://github.com/${encodeURIComponent(name)}`;
  if (providerId === 'twitter') return `https://x.com/${encodeURIComponent(name)}`;
  return null;
}

function publicBuilder(row) {
  return {
    userId: row.userId,
    name: row.name,
    image: row.image,
    url: row.url || null,
    note: row.note || null,
    socialUrl: deriveSocialUrl(row.providerId, row.name),
    createdAt: row.createdAt,
  };
}

// Bulk state for the showcase grid: vote counts per idea + builder counts + the current user's votes
router.get('/ideas/state', async (req, res, next) => {
  try {
    const user = await getUser(req);
    const counts = {};
    for (const row of voteCountsAll.all()) {
      counts[row.ideaId] = { votes: row.count, builders: 0 };
    }
    for (const row of buildersByIdea.all()) {
      if (!counts[row.ideaId]) counts[row.ideaId] = { votes: 0, builders: 0 };
      counts[row.ideaId].builders += 1;
    }
    const myVotes = user ? myVotesAll.all(user.id).map((r) => r.ideaId) : [];
    res.json({ counts, myVotes });
  } catch (err) {
    next(err);
  }
});

// Per-idea detail: full builder list + vote count + whether the current user voted
router.get('/ideas/:id/state', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUser(req);
    const votes = voteCountForIdea.get(id)?.count ?? 0;
    const builders = buildersForIdea.all(id).map(publicBuilder);
    const myVote = user ? !!hasMyVote.get(id, user.id) : false;
    const myWorking = user ? builders.find((b) => b.userId === user.id) || null : null;
    res.json({ ideaId: id, votes, builders, myVote, myWorking });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/ideas/:id/vote',
  requireUser(async (req, res) => {
    const { id } = req.params;
    try {
      insertVote.run(id, req.user.id, Date.now());
    } catch (err) {
      if (String(err.message).includes('UNIQUE')) {
        return res.status(409).json({ error: 'Already voted' });
      }
      throw err;
    }
    const votes = voteCountForIdea.get(id)?.count ?? 0;
    res.json({ ok: true, votes, voted: true });
  })
);

router.delete(
  '/ideas/:id/vote',
  requireUser(async (req, res) => {
    const { id } = req.params;
    deleteVote.run(id, req.user.id);
    const votes = voteCountForIdea.get(id)?.count ?? 0;
    res.json({ ok: true, votes, voted: false });
  })
);

router.post(
  '/ideas/:id/working',
  requireUser(async (req, res) => {
    const { id } = req.params;
    const { url, note } = req.body || {};
    if (url && typeof url !== 'string') {
      return res.status(400).json({ error: 'url must be a string' });
    }
    if (url && url.length > 500) {
      return res.status(400).json({ error: 'url too long' });
    }
    if (note && typeof note !== 'string') {
      return res.status(400).json({ error: 'note must be a string' });
    }
    if (note && note.length > 500) {
      return res.status(400).json({ error: 'note too long' });
    }
    upsertWorking.run(id, req.user.id, url || null, note || null, Date.now());
    const builders = buildersForIdea.all(id).map(publicBuilder);
    res.json({ ok: true, builders });
  })
);

router.delete(
  '/ideas/:id/working',
  requireUser(async (req, res) => {
    const { id } = req.params;
    deleteWorking.run(id, req.user.id);
    const builders = buildersForIdea.all(id).map(publicBuilder);
    res.json({ ok: true, builders });
  })
);

export default router;
