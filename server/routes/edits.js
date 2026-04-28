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

const insertEdit = db.prepare(`
  INSERT INTO edits (id, ideaId, title, problem, solutionSketch, whyEthereum, domains, resources, submitterId, status, createdAt, updatedAt)
  VALUES (@id, @ideaId, @title, @problem, @solutionSketch, @whyEthereum, @domains, @resources, @submitterId, 'pending', @now, @now)
`);
const getPendingEdits = db.prepare(`
  SELECT e.*, u.name AS submitterName, u.email AS submitterEmail
  FROM edits e JOIN user u ON u.id = e.submitterId
  WHERE e.status = 'pending' ORDER BY e.createdAt ASC
`);
const getRejectedEdits = db.prepare(`
  SELECT e.*, u.name AS submitterName, u.email AS submitterEmail
  FROM edits e JOIN user u ON u.id = e.submitterId
  WHERE e.status = 'rejected' ORDER BY e.updatedAt DESC
`);
const getEditById = db.prepare(`SELECT * FROM edits WHERE id = ?`);
const setEditApproved = db.prepare(`
  UPDATE edits SET status = 'approved', updatedAt = ? WHERE id = ? AND status = 'pending'
`);
const setEditRejected = db.prepare(`
  UPDATE edits SET status = 'rejected', rejectionReason = ?, updatedAt = ? WHERE id = ? AND status = 'pending'
`);
const setEditRestored = db.prepare(`
  UPDATE edits SET status = 'pending', rejectionReason = NULL, updatedAt = ? WHERE id = ? AND status = 'rejected'
`);
const upsertOverride = db.prepare(`
  INSERT INTO idea_overrides (ideaId, title, problem, solutionSketch, whyEthereum, domains, resources, approvedAt, approvedBy)
  VALUES (@ideaId, @title, @problem, @solutionSketch, @whyEthereum, @domains, @resources, @approvedAt, @approvedBy)
  ON CONFLICT(ideaId) DO UPDATE SET
    title = excluded.title,
    problem = excluded.problem,
    solutionSketch = excluded.solutionSketch,
    whyEthereum = excluded.whyEthereum,
    domains = excluded.domains,
    resources = excluded.resources,
    approvedAt = excluded.approvedAt,
    approvedBy = excluded.approvedBy
`);
const allOverrides = db.prepare(`SELECT * FROM idea_overrides`);
const updateSubmissionFields = db.prepare(`
  UPDATE submissions
  SET title = COALESCE(?, title),
      problem = COALESCE(?, problem),
      solutionSketch = COALESCE(?, solutionSketch),
      whyEthereum = COALESCE(?, whyEthereum),
      domains = COALESCE(?, domains),
      resources = COALESCE(?, resources),
      updatedAt = ?
  WHERE id = ?
`);
const findSubmission = db.prepare(`SELECT id FROM submissions WHERE id = ?`);

function newId() {
  return randomBytes(8).toString('hex');
}

function rowToEditView(row) {
  return {
    id: row.id,
    ideaId: row.ideaId,
    title: row.title,
    problem: row.problem,
    solutionSketch: row.solutionSketch,
    whyEthereum: row.whyEthereum,
    domains: row.domains ? JSON.parse(row.domains) : null,
    resources: row.resources ? JSON.parse(row.resources) : null,
    status: row.status,
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

function rowToOverride(row) {
  return {
    ideaId: row.ideaId,
    title: row.title,
    problem: row.problem,
    solutionSketch: row.solutionSketch,
    whyEthereum: row.whyEthereum,
    domains: row.domains ? JSON.parse(row.domains) : undefined,
    resources: row.resources ? JSON.parse(row.resources) : undefined,
  };
}

// Public: all approved overrides keyed by ideaId — applied client-side over markdown ideas
router.get('/edits/overrides', (req, res) => {
  const map = {};
  for (const row of allOverrides.all()) map[row.ideaId] = rowToOverride(row);
  res.json(map);
});

// Authenticated: propose an edit to an existing idea
router.post('/edits', async (req, res, next) => {
  try {
    const user = await getUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthenticated' });

    const {
      ideaId,
      title,
      problem,
      solutionSketch,
      whyEthereum,
      domains,
      resources,
    } = req.body || {};

    if (typeof ideaId !== 'string' || !ideaId.length) {
      return res.status(400).json({ error: 'ideaId required' });
    }
    const validateOptional = (v, max, name) => {
      if (v === undefined || v === null || v === '') return null;
      if (typeof v !== 'string') return `${name} must be a string`;
      if (v.length > max) return `${name} too long`;
      return null;
    };
    const errs = [
      validateOptional(title, 120, 'title'),
      validateOptional(problem, 2000, 'problem'),
      validateOptional(solutionSketch, 2000, 'solutionSketch'),
      validateOptional(whyEthereum, 2000, 'whyEthereum'),
    ].filter(Boolean);
    if (errs.length) return res.status(400).json({ error: errs[0] });
    if (
      domains !== undefined &&
      domains !== null &&
      (!Array.isArray(domains) || domains.length === 0 || domains.length > 4)
    ) {
      return res.status(400).json({ error: 'domains must be 1-4 items' });
    }
    if (resources !== undefined && resources !== null && !Array.isArray(resources)) {
      return res.status(400).json({ error: 'resources must be an array' });
    }

    const id = newId();
    const now = Date.now();
    insertEdit.run({
      id,
      ideaId,
      title: title?.trim() || null,
      problem: problem?.trim() || null,
      solutionSketch: solutionSketch?.trim() || null,
      whyEthereum: whyEthereum?.trim() || null,
      domains: domains ? JSON.stringify(domains) : null,
      resources: resources ? JSON.stringify(resources) : null,
      submitterId: user.id,
      now,
    });
    res.status(201).json({ id, status: 'pending' });
  } catch (err) {
    next(err);
  }
});

// --- Admin ---
router.get('/admin/edits', async (req, res, next) => {
  try {
    const user = await getUser(req);
    if (!isAdmin(user)) return res.status(404).end();
    res.json(getPendingEdits.all().map(rowToEditView));
  } catch (err) {
    next(err);
  }
});

router.get('/admin/edits/rejected', async (req, res, next) => {
  try {
    const user = await getUser(req);
    if (!isAdmin(user)) return res.status(404).end();
    res.json(getRejectedEdits.all().map(rowToEditView));
  } catch (err) {
    next(err);
  }
});

router.post('/admin/edits/:id/approve', async (req, res, next) => {
  try {
    const user = await getUser(req);
    if (!isAdmin(user)) return res.status(404).end();
    const row = getEditById.get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    if (row.status !== 'pending')
      return res.status(409).json({ error: 'Not pending' });

    const now = Date.now();

    // Apply the edit. If it targets a DB-backed submission, update that row directly.
    // Otherwise (markdown idea), upsert into idea_overrides which the public read merges.
    const dbIdea = findSubmission.get(row.ideaId);
    if (dbIdea) {
      updateSubmissionFields.run(
        row.title,
        row.problem,
        row.solutionSketch,
        row.whyEthereum,
        row.domains,
        row.resources,
        now,
        row.ideaId
      );
    } else {
      upsertOverride.run({
        ideaId: row.ideaId,
        title: row.title,
        problem: row.problem,
        solutionSketch: row.solutionSketch,
        whyEthereum: row.whyEthereum,
        domains: row.domains,
        resources: row.resources,
        approvedAt: now,
        approvedBy: user.id,
      });
    }

    setEditApproved.run(now, row.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.post('/admin/edits/:id/reject', async (req, res, next) => {
  try {
    const user = await getUser(req);
    if (!isAdmin(user)) return res.status(404).end();
    const reason = (req.body?.reason || '').toString().slice(0, 500);
    const result = setEditRejected.run(reason, Date.now(), req.params.id);
    if (result.changes === 0) return res.status(409).json({ error: 'Not pending' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.post('/admin/edits/:id/restore', async (req, res, next) => {
  try {
    const user = await getUser(req);
    if (!isAdmin(user)) return res.status(404).end();
    const result = setEditRestored.run(Date.now(), req.params.id);
    if (result.changes === 0) return res.status(409).json({ error: 'Not rejected' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
