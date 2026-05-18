#!/usr/bin/env node
import { readFileSync, readdirSync, writeFileSync, statSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const IDEAS_DIR = join(__dirname, '..', 'public', 'data', 'ideas');
const OUTPUT = join(__dirname, '..', 'public', 'ideas.json');

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

function buildOne(filename) {
  const id = filename.replace(/\.md$/, '');
  const filePath = join(IDEAS_DIR, filename);
  const content = readFileSync(filePath, 'utf-8');
  const { meta, body } = parseFrontmatter(content);
  const createdAt = gitCreatedAt(filePath) || new Date(statSync(filePath).mtimeMs).toISOString();
  const updatedAt = gitUpdatedAt(filePath) || createdAt;
  return {
    id,
    title: meta.title || id,
    domains: (meta.domains || '').split(',').map((d) => d.trim()).filter(Boolean),
    problem: parseSection(body, 'Problem'),
    solutionSketch: parseSection(body, 'Solution'),
    whyEthereum: parseSection(body, 'Why Ethereum'),
    author: meta.author || 'Use Case Lab',
    createdAt,
    updatedAt,
  };
}

function main() {
  const files = readdirSync(IDEAS_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort();
  const ideas = files.map(buildOne);
  writeFileSync(OUTPUT, JSON.stringify(ideas, null, 2) + '\n');
  console.log(`Built ${ideas.length} ideas → ${OUTPUT.replace(process.cwd() + '/', '')}`);
}

main();
