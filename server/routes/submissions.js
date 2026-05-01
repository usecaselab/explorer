import { Router } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { randomBytes } from 'crypto';
import { db } from '../db.js';
import { auth } from '../auth.js';

const router = Router();

const ADMINS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

function isAdmin(user) {
  return !!(user && ADMINS.includes((user.email || '').toLowerCase()));
}

async function getUser(req) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return session?.user ?? null;
}

const insertSubmission = db.prepare(`
  INSERT INTO submissions (id, title, problem, solutionSketch, whyEthereum, domains, submitterId, status, paymentTxHash, createdAt, updatedAt)
  VALUES (@id, @title, @problem, @solutionSketch, @whyEthereum, @domains, @submitterId, 'pending', @paymentTxHash, @now, @now)
`);
const getSubmission = db.prepare(`SELECT * FROM submissions WHERE id = ?`);
const getMySubmissions = db.prepare(`
  SELECT * FROM submissions WHERE submitterId = ? ORDER BY createdAt DESC
`);
const getPending = db.prepare(`
  SELECT s.*, u.name AS submitterName, u.email AS submitterEmail
  FROM submissions s JOIN user u ON u.id = s.submitterId
  WHERE s.status = 'pending' ORDER BY s.createdAt ASC
`);
const getRejected = db.prepare(`
  SELECT s.*, u.name AS submitterName, u.email AS submitterEmail
  FROM submissions s JOIN user u ON u.id = s.submitterId
  WHERE s.status = 'rejected' ORDER BY s.updatedAt DESC
`);
const getApproved = db.prepare(`
  SELECT * FROM submissions WHERE status = 'approved' ORDER BY createdAt ASC
`);
const setApproved = db.prepare(`
  UPDATE submissions SET status = 'approved', rejectionReason = NULL, updatedAt = ? WHERE id = ? AND status = 'pending'
`);
const setRejected = db.prepare(`
  UPDATE submissions SET status = 'rejected', rejectionReason = ?, updatedAt = ? WHERE id = ? AND status = 'pending'
`);
const setRestored = db.prepare(`
  UPDATE submissions SET status = 'pending', rejectionReason = NULL, updatedAt = ? WHERE id = ? AND status = 'rejected'
`);

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function newId(title) {
  const base = slugify(title) || 'idea';
  const suffix = randomBytes(3).toString('hex');
  return `${base}-${suffix}`;
}

function rowToIdea(row) {
  return {
    id: row.id,
    title: row.title,
    problem: row.problem,
    solutionSketch: row.solutionSketch,
    whyEthereum: row.whyEthereum,
    domains: JSON.parse(row.domains),
    status: row.status,
    submittedBy: row.submitterId,
  };
}

function rowToAdminView(row) {
  return {
    ...rowToIdea(row),
    rejectionReason: row.rejectionReason || null,
    submitter: {
      id: row.submitterId,
      name: row.submitterName,
      email: row.submitterEmail,
    },
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// Public: list of approved community-submitted ideas, merged into the explorer
router.get('/submissions/approved', (req, res) => {
  const rows = getApproved.all();
  res.json(rows.map(rowToIdea));
});

// Submitter: my submissions and their statuses
router.get('/submissions/mine', async (req, res, next) => {
  try {
    const user = await getUser(req);
    if (!user) return res.json([]);
    res.json(getMySubmissions.all(user.id).map(rowToIdea));
  } catch (err) {
    next(err);
  }
});

router.get('/submissions/:id', (req, res) => {
  const row = getSubmission.get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(rowToIdea(row));
});

// Submit a new idea (TODO: add x402 payment gating in a follow-up)
router.post('/submissions', async (req, res, next) => {
  try {
    const user = await getUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthenticated' });

    const {
      title,
      problem,
      solutionSketch,
      whyEthereum,
      domains,
    } = req.body || {};

    if (typeof title !== 'string' || title.length < 4 || title.length > 120) {
      return res.status(400).json({ error: 'title must be 4-120 chars' });
    }
    if (typeof problem !== 'string' || problem.length < 10 || problem.length > 2000) {
      return res.status(400).json({ error: 'problem must be 10-2000 chars' });
    }
    if (typeof solutionSketch !== 'string' || solutionSketch.length < 10 || solutionSketch.length > 2000) {
      return res.status(400).json({ error: 'solutionSketch must be 10-2000 chars' });
    }
    if (typeof whyEthereum !== 'string' || whyEthereum.length < 10 || whyEthereum.length > 2000) {
      return res.status(400).json({ error: 'whyEthereum must be 10-2000 chars' });
    }
    if (!Array.isArray(domains) || domains.length === 0 || domains.length > 4) {
      return res.status(400).json({ error: 'domains must be 1-4 items' });
    }

    const id = newId(title);
    const now = Date.now();
    insertSubmission.run({
      id,
      title: title.trim(),
      problem: problem.trim(),
      solutionSketch: solutionSketch.trim(),
      whyEthereum: whyEthereum.trim(),
      domains: JSON.stringify(domains),
      submitterId: user.id,
      paymentTxHash: null,
      now,
    });

    res.status(201).json({ id, status: 'pending' });
  } catch (err) {
    next(err);
  }
});

// --- Admin ---
router.get('/admin/submissions', async (req, res, next) => {
  try {
    const user = await getUser(req);
    if (!isAdmin(user)) return res.status(404).end();
    res.json(getPending.all().map(rowToAdminView));
  } catch (err) {
    next(err);
  }
});

router.post('/admin/submissions/:id/approve', async (req, res, next) => {
  try {
    const user = await getUser(req);
    if (!isAdmin(user)) return res.status(404).end();
    const result = setApproved.run(Date.now(), req.params.id);
    if (result.changes === 0) return res.status(409).json({ error: 'Not pending' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.post('/admin/submissions/:id/reject', async (req, res, next) => {
  try {
    const user = await getUser(req);
    if (!isAdmin(user)) return res.status(404).end();
    const reason = (req.body?.reason || '').toString().slice(0, 500);
    const result = setRejected.run(reason, Date.now(), req.params.id);
    if (result.changes === 0) return res.status(409).json({ error: 'Not pending' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.get('/admin/submissions/rejected', async (req, res, next) => {
  try {
    const user = await getUser(req);
    if (!isAdmin(user)) return res.status(404).end();
    res.json(getRejected.all().map(rowToAdminView));
  } catch (err) {
    next(err);
  }
});

router.post('/admin/submissions/:id/restore', async (req, res, next) => {
  try {
    const user = await getUser(req);
    if (!isAdmin(user)) return res.status(404).end();
    const result = setRestored.run(Date.now(), req.params.id);
    if (result.changes === 0) return res.status(409).json({ error: 'Not rejected' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.get('/admin/me', async (req, res) => {
  const user = await getUser(req);
  res.json({ isAdmin: isAdmin(user) });
});

export default router;
