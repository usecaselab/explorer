#!/usr/bin/env node

/**
 * Reads individual markdown files from public/data/*.md and generates
 * public/ideas.json for the app to consume at runtime.
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';

const DATA_DIR = join(import.meta.dirname, '..', 'public', 'data');
const OUT_FILE = join(import.meta.dirname, '..', 'public', 'ideas.json');

const VALID_DOMAINS = new Set([
  'ai', 'business-operations', 'civil-society', 'commerce', 'environment',
  'finance', 'food-and-agriculture', 'government', 'health', 'identity',
  'insurance', 'logistics-and-trade', 'media', 'real-estate-and-housing',
  'science', 'utilities',
]);

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) throw new Error('Missing frontmatter');
  const meta = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    // strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    meta[key] = val;
  }
  const body = content.slice(match[0].length);
  return { meta, body };
}

function parseSection(body, heading) {
  const regex = new RegExp(`## ${heading}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`);
  const match = body.match(regex);
  return match ? match[1].trim() : '';
}

function parseLinks(body, heading) {
  const raw = parseSection(body, heading);
  if (!raw) return [];
  const links = [];
  for (const line of raw.split('\n')) {
    const m = line.match(/^- \[([^\]]+)\]\(([^)]+)\)(?:\s*-\s*(.*))?$/);
    if (m) {
      links.push({ name: m[1], url: m[2], description: m[3] || '' });
    }
  }
  return links;
}

const files = readdirSync(DATA_DIR).filter(f => f.endsWith('.md')).sort();
const ideas = [];

for (const file of files) {
  const content = readFileSync(join(DATA_DIR, file), 'utf-8');
  const { meta, body } = parseFrontmatter(content);
  const id = basename(file, '.md');
  const domains = (meta.domains || '').split(',').map(d => d.trim()).filter(Boolean);
  for (const d of domains) {
    if (!VALID_DOMAINS.has(d)) console.warn(`  WARNING: unknown domain "${d}" in ${file}`);
  }

  const entry = {
    id,
    title: meta.title,
    problem: parseSection(body, 'Problem'),
    solutionSketch: parseSection(body, 'Solution'),
    whyEthereum: parseSection(body, 'Why Ethereum'),
    domains,
    resources: parseLinks(body, 'Resources'),
  };
  const examples = parseLinks(body, 'Examples');
  if (examples.length > 0) entry.examples = examples;
  ideas.push(entry);
}

writeFileSync(OUT_FILE, JSON.stringify(ideas, null, 2) + '\n');
console.log(`Generated ${ideas.length} ideas → ${OUT_FILE}`);
