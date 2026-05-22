#!/usr/bin/env node
import { readFileSync, readdirSync, writeFileSync, statSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const IDEAS_DIR = join(__dirname, '..', 'public', 'data', 'ideas');
const PERSONAS_DIR = join(__dirname, '..', 'public', 'data', 'personas');
const IDEAS_OUT = join(__dirname, '..', 'public', 'ideas.json');
const PERSONAS_OUT = join(__dirname, '..', 'public', 'personas.json');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { meta: {}, body: content };
  try {
    return { meta: yaml.load(match[1]) || {}, body: content.slice(match[0].length) };
  } catch (e) {
    console.error('YAML parse error:', e.message);
    return { meta: {}, body: content.slice(match[0].length) };
  }
}

function parseSection(body, heading) {
  const re = new RegExp(`## ${heading}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`);
  const m = body.match(re);
  return m ? m[1].trim() : '';
}

function gitCreatedAt(filePath) {
  try {
    const out = execSync(`git log --diff-filter=A --follow --format=%aI -- "${filePath}"`, {
      encoding: 'utf-8',
    }).trim();
    const lines = out.split('\n').filter(Boolean);
    if (lines.length === 0) return null;
    return lines[lines.length - 1];
  } catch {
    return null;
  }
}

function gitUpdatedAt(filePath) {
  try {
    const out = execSync(`git log -1 --format=%aI -- "${filePath}"`, {
      encoding: 'utf-8',
    }).trim();
    return out || null;
  } catch {
    return null;
  }
}

function buildIdea(filename) {
  const id = filename.replace(/\.md$/, '');
  const filePath = join(IDEAS_DIR, filename);
  const content = readFileSync(filePath, 'utf-8');
  const { meta, body } = parseFrontmatter(content);
  const createdAt = gitCreatedAt(filePath) || new Date(statSync(filePath).mtimeMs).toISOString();
  const updatedAt = gitUpdatedAt(filePath) || createdAt;
  const domainsRaw = meta.domains;
  const domains = Array.isArray(domainsRaw)
    ? domainsRaw
    : (typeof domainsRaw === 'string' ? domainsRaw.split(',').map((d) => d.trim()).filter(Boolean) : []);
  return {
    id,
    title: meta.title || id,
    domains,
    problem: parseSection(body, 'Problem'),
    solutionSketch: parseSection(body, 'Solution'),
    whyEthereum: parseSection(body, 'Why Ethereum'),
    author: meta.author || 'Use Case Lab',
    createdAt,
    updatedAt,
  };
}

function buildPersona(filename) {
  const filePath = join(PERSONAS_DIR, filename);
  const content = readFileSync(filePath, 'utf-8');
  const { meta } = parseFrontmatter(content);
  return {
    id: meta.id,
    name: meta.name,
    portraits: (meta.portraits || []).map((p) => ({
      name: p.name,
      role: p.role || '',
      location: p.location || '',
      icon: p.icon || 'user',
    })),
    desires: (meta.desires || []).map((d) => ({
      id: d.id,
      title: d.title,
      framing: (d.framing || '').trim(),
      ideas: d.ideas || [],
    })),
  };
}

function computeRelated(personas) {
  // For each persona, find personas that share the most desire IDs.
  // Returns top 3 with at least one shared desire.
  const desiresByPersona = {};
  for (const p of personas) {
    desiresByPersona[p.id] = new Set(p.desires.map((d) => d.id));
  }
  const related = {};
  for (const p of personas) {
    const scores = [];
    for (const q of personas) {
      if (q.id === p.id) continue;
      let shared = 0;
      for (const d of desiresByPersona[p.id]) {
        if (desiresByPersona[q.id].has(d)) shared++;
      }
      if (shared > 0) scores.push({ id: q.id, name: q.name, shared });
    }
    scores.sort((a, b) => b.shared - a.shared);
    related[p.id] = scores.slice(0, 3);
  }
  return related;
}

function main() {
  const ideaFiles = readdirSync(IDEAS_DIR).filter((f) => f.endsWith('.md')).sort();
  const ideas = ideaFiles.map(buildIdea);
  writeFileSync(IDEAS_OUT, JSON.stringify(ideas, null, 2) + '\n');
  console.log(`Built ${ideas.length} ideas → ${IDEAS_OUT.replace(process.cwd() + '/', '')}`);

  const personaFiles = readdirSync(PERSONAS_DIR).filter((f) => f.endsWith('.md')).sort();
  const personas = personaFiles.map(buildPersona);
  const related = computeRelated(personas);
  const withRelated = personas.map((p) => ({ ...p, related: related[p.id] }));
  writeFileSync(PERSONAS_OUT, JSON.stringify(withRelated, null, 2) + '\n');
  console.log(`Built ${personas.length} personas → ${PERSONAS_OUT.replace(process.cwd() + '/', '')}`);
}

main();
