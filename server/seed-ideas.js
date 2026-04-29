import { readFileSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const IDEAS_DIR = join(__dirname, '..', 'public', 'data', 'ideas');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return { meta: {}, body: content };
  const meta = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    meta[key] = val;
  }
  return { meta, body: content.slice(match[0].length) };
}

function parseSection(body, heading) {
  const re = new RegExp(`## ${heading}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`);
  const m = body.match(re);
  return m ? m[1].trim() : '';
}

function parseLinks(body, heading) {
  const raw = parseSection(body, heading);
  if (!raw) return [];
  const links = [];
  for (const line of raw.split('\n')) {
    const m = line.match(/^- \[([^\]]+)\]\(([^)]+)\)(?:\s*-\s*(.*))?$/);
    if (m) links.push({ name: m[1], url: m[2], description: m[3] || '' });
  }
  return links;
}

function parseIdeaMarkdown(content, id) {
  const { meta, body } = parseFrontmatter(content);
  return {
    id,
    title: meta.title || id,
    problem: parseSection(body, 'Problem'),
    solutionSketch: parseSection(body, 'Solution'),
    whyEthereum: parseSection(body, 'Why Ethereum'),
    domains: (meta.domains || '').split(',').map((d) => d.trim()).filter(Boolean),
    resources: parseLinks(body, 'Resources'),
  };
}

const insertIdea = db.prepare(
  `INSERT OR IGNORE INTO ideas
     (id, title, problem, solutionSketch, whyEthereum, domains, resources, author, submitterId, createdAt, updatedAt)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)`
);

// Backfill createdAt from file mtime for any seeded rows that still have a uniform timestamp.
const updateCreatedAt = db.prepare(
  `UPDATE ideas SET createdAt = ? WHERE id = ? AND author = 'Use Case Lab' AND createdAt = ?`
);

const countIdeas = db.prepare(`SELECT COUNT(*) AS n FROM ideas`);
const findUniformSeedTimestamp = db.prepare(
  `SELECT createdAt, COUNT(*) AS n FROM ideas WHERE author = 'Use Case Lab' GROUP BY createdAt ORDER BY n DESC LIMIT 1`
);

export function seedCuratedIdeas() {
  let manifest;
  try {
    const raw = readFileSync(join(IDEAS_DIR, 'manifest.json'), 'utf8');
    manifest = JSON.parse(raw);
  } catch (err) {
    console.warn('Could not read ideas manifest — skipping seed.', err.message);
    return;
  }

  const beforeCount = countIdeas.get().n;

  // Detect a uniform legacy seed (everything inserted at one Date.now()) so we can backfill it.
  const uniformRow = findUniformSeedTimestamp.get();
  const legacyTimestamp = uniformRow && uniformRow.n > 1 ? uniformRow.createdAt : null;

  let inserted = 0;
  let backfilled = 0;

  const tx = db.transaction((files) => {
    for (const filename of files) {
      const id = filename.replace(/\.md$/, '');
      const filePath = join(IDEAS_DIR, filename);
      let content;
      let mtimeMs;
      try {
        content = readFileSync(filePath, 'utf8');
        mtimeMs = Math.floor(statSync(filePath).mtimeMs);
      } catch {
        continue;
      }
      const idea = parseIdeaMarkdown(content, id);
      const result = insertIdea.run(
        idea.id,
        idea.title,
        idea.problem,
        idea.solutionSketch,
        idea.whyEthereum,
        JSON.stringify(idea.domains),
        JSON.stringify(idea.resources),
        'Use Case Lab',
        mtimeMs,
        mtimeMs
      );
      if (result.changes > 0) {
        inserted++;
      } else if (legacyTimestamp != null) {
        const r = updateCreatedAt.run(mtimeMs, idea.id, legacyTimestamp);
        if (r.changes > 0) backfilled++;
      }
    }
  });

  tx(manifest);

  const afterCount = countIdeas.get().n;
  console.log(
    `Ideas seed: inserted ${inserted} new, backfilled ${backfilled} createdAt (${afterCount} total, ${beforeCount} already present).`
  );
}
