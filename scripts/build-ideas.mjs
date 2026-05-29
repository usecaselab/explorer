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
const LLMS_OUT = join(__dirname, '..', 'public', 'llms.txt');
const LLMS_FULL_OUT = join(__dirname, '..', 'public', 'llms-full.txt');

// Mirror of DOMAIN_CONFIG in components/IdeaShowcase.tsx (label only). Kept
// here so the llms.txt output uses human-readable labels.
const DOMAIN_LABELS = {
  'ai':                      'AI',
  'business-operations':     'Business Operations',
  'civil-society':           'Civil Society',
  'commerce':                'Commerce',
  'environment':             'Environment',
  'finance':                 'Finance',
  'food-and-agriculture':    'Food & Agriculture',
  'government':              'Government',
  'health':                  'Health',
  'identity':                'Identity',
  'insurance':               'Insurance',
  'logistics-and-trade':     'Logistics & Trade',
  'media':                   'Media',
  'real-estate-and-housing': 'Real Estate & Housing',
  'science':                 'Science',
  'utilities':               'Utilities',
};

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
  // Ideas declare which persona desires they fulfill, as `personaId/desireId`
  // refs. The reverse-index (which ideas appear under a given persona desire)
  // is computed in attachIdeasToDesires below.
  const desiresRaw = meta.desires;
  const desires = Array.isArray(desiresRaw)
    ? desiresRaw.map((d) => String(d).trim()).filter(Boolean)
    : (typeof desiresRaw === 'string' ? desiresRaw.split(',').map((d) => d.trim()).filter(Boolean) : []);
  return {
    id,
    title: meta.title || id,
    domains,
    desires,
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
    // `ideas` per desire is computed (not read from persona frontmatter) —
    // see attachIdeasToDesires.
    desires: (meta.desires || []).map((d) => ({
      id: d.id,
      title: d.title,
      framing: (d.framing || '').trim(),
      ideas: [],
    })),
  };
}

// Walk every idea's `desires` refs and populate the corresponding
// `desire.ideas` list on each persona. Single source of truth: each idea
// declares which (persona, desire) pairs it serves; everything else is built
// from that. Returns a list of validation warnings.
function attachIdeasToDesires(ideas, personas) {
  const personaById = new Map(personas.map((p) => [p.id, p]));
  const warnings = [];
  for (const idea of ideas) {
    for (const ref of idea.desires || []) {
      const slash = ref.indexOf('/');
      if (slash <= 0) {
        warnings.push(`idea "${idea.id}" has malformed desire ref "${ref}" (expected personaId/desireId)`);
        continue;
      }
      const personaId = ref.slice(0, slash);
      const desireId = ref.slice(slash + 1);
      const persona = personaById.get(personaId);
      if (!persona) {
        warnings.push(`idea "${idea.id}" references unknown persona "${personaId}"`);
        continue;
      }
      const desire = persona.desires.find((d) => d.id === desireId);
      if (!desire) {
        warnings.push(`idea "${idea.id}" references unknown desire "${ref}"`);
        continue;
      }
      desire.ideas.push(idea.id);
    }
  }
  return warnings;
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

// /llms.txt — entry point for AI agents and LLM tooling. Kept deliberately
// short and stable: just describe the corpus, point at the richer surfaces,
// document the URL conventions. The actual data (domains, personas, ideas)
// changes constantly — agents follow the pointers to read the live state.
function buildLlmsTxt() {
  return [
    '# Use Case Lab',
    '',
    '> A curated index of Ethereum use cases organized by the people they would benefit. Each entry is a short sketch: a real problem, a solution, and the reason a centralized version would not serve the user as well.',
    '',
    'This file is the entry point for AI agents and LLM tooling. The full corpus is available in the machine-readable formats below; the human-facing site is at https://usecaselab.org.',
    '',
    '## Resources',
    '',
    '- /llms-full.txt — Full corpus (every idea and persona) inline as markdown. Load this when you need depth.',
    '- /ideas.json — Ideas as structured JSON. Each idea has: id, title, domains, desires (persona-desire refs in the form `personaId/desireId`), problem, solutionSketch, whyEthereum, author, createdAt, updatedAt.',
    '- /personas.json — Personas as structured JSON. Each persona has: id, name, portraits, and desires; each desire carries a computed list of ideas that address it.',
    '',
    '## URL conventions',
    '',
    '- https://usecaselab.org/idea/<id> — rendered idea page (id matches the JSON id and the markdown filename in public/data/ideas/).',
    '- https://usecaselab.org/persona/<id> — rendered persona page (id matches the JSON id and the markdown filename in public/data/personas/).',
    '',
    '## Source',
    '',
    'https://github.com/usecaselab/explorer (MIT). PR-driven contribution. The data model, field schemas, and review guidelines are documented in the README.',
    '',
  ].join('\n');
}

// /llms-full.txt — the entire corpus inline, ideas + personas in markdown.
// This is what an agent loads when the user wants depth, not just pointers.
function buildLlmsFullTxt(ideas, personas) {
  let s = '';
  s += '# Use Case Lab — Full Corpus\n\n';
  s += 'A working atlas of where Ethereum meets the real world. Each entry below is one application of Ethereum to a specific real-world problem, with the cypherpunk reason a centralized version would fail.\n\n';
  s += 'Site: https://usecaselab.org\n';
  s += 'Source: https://github.com/usecaselab/explorer\n\n';
  s += '---\n\n';

  s += `# Personas (${personas.length})\n\n`;
  for (const p of personas) {
    s += `## ${p.name}\n\n`;
    s += `URL: https://usecaselab.org/persona/${p.id}\n\n`;
    if (p.portraits && p.portraits.length) {
      s += '### Example people\n\n';
      for (const portrait of p.portraits) {
        const parts = [portrait.name, portrait.role, portrait.location].filter(Boolean);
        s += `- ${parts.join(', ')}\n`;
      }
      s += '\n';
    }
    if (p.desires && p.desires.length) {
      s += '### Desires\n\n';
      p.desires.forEach((d, i) => {
        s += `${i + 1}. ${d.title}\n`;
        if (d.framing) s += `   ${d.framing}\n`;
        if (d.ideas && d.ideas.length) {
          s += `   Related ideas: ${d.ideas.join(', ')}\n`;
        }
        s += '\n';
      });
    }
    s += '---\n\n';
  }

  s += `# Ideas (${ideas.length})\n\n`;
  for (const idea of ideas) {
    s += `## ${idea.title}\n\n`;
    s += `ID: \`${idea.id}\`\n`;
    if (idea.domains && idea.domains.length) {
      s += `Domains: ${idea.domains.map((d) => DOMAIN_LABELS[d] || d).join(', ')}\n`;
    }
    s += `URL: https://usecaselab.org/idea/${idea.id}\n\n`;
    if (idea.problem)        s += `### Problem\n\n${idea.problem}\n\n`;
    if (idea.solutionSketch) s += `### Solution\n\n${idea.solutionSketch}\n\n`;
    if (idea.whyEthereum)    s += `### Why Ethereum\n\n${idea.whyEthereum}\n\n`;
    s += '---\n\n';
  }

  return s;
}

function main() {
  const ideaFiles = readdirSync(IDEAS_DIR).filter((f) => f.endsWith('.md')).sort();
  const ideas = ideaFiles.map(buildIdea);

  const personaFiles = readdirSync(PERSONAS_DIR).filter((f) => f.endsWith('.md')).sort();
  const personas = personaFiles.map(buildPersona);

  // Reverse-index idea.desires into persona desires before serializing.
  const warnings = attachIdeasToDesires(ideas, personas);
  for (const w of warnings) console.warn(`! ${w}`);

  writeFileSync(IDEAS_OUT, JSON.stringify(ideas, null, 2) + '\n');
  console.log(`Built ${ideas.length} ideas → ${IDEAS_OUT.replace(process.cwd() + '/', '')}`);

  const related = computeRelated(personas);
  const withRelated = personas.map((p) => ({ ...p, related: related[p.id] }));
  writeFileSync(PERSONAS_OUT, JSON.stringify(withRelated, null, 2) + '\n');
  console.log(`Built ${personas.length} personas → ${PERSONAS_OUT.replace(process.cwd() + '/', '')}`);

  writeFileSync(LLMS_OUT, buildLlmsTxt());
  console.log(`Built llms.txt → ${LLMS_OUT.replace(process.cwd() + '/', '')}`);

  writeFileSync(LLMS_FULL_OUT, buildLlmsFullTxt(ideas, withRelated));
  console.log(`Built llms-full.txt → ${LLMS_FULL_OUT.replace(process.cwd() + '/', '')}`);
}

main();
