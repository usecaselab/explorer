import express from 'express';
import cors from 'cors';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Parse markdown files on startup
let usecases = [];

function parseMarkdownFile(filePath, id) {
  const content = readFileSync(filePath, 'utf8');
  const text = content.replace(/\r\n/g, '\n');

  // Parse title
  const titleMatch = text.match(/^#\s+([^*\n]+)$/m);
  let title = titleMatch ? titleMatch[1].trim() : id;

  // Split into sections
  const sections = text.split(/^#{1,3}\s+/m);

  let problemStatement = '';
  let ideas = [];
  let projects = [];
  let resources = [];

  sections.forEach(section => {
    const lines = section.trim().split('\n');
    const header = lines[0].trim().replace(/\*\*/g, '').toLowerCase();
    const sectionContent = lines.slice(1).join('\n').trim();

    if (header.startsWith('problem') || header.startsWith('the opportunity')) {
      problemStatement = sectionContent
        .split('\n')
        .filter(line => !line.startsWith('Categories:') && !line.startsWith('Last edited time:') && line.trim() !== '---')
        .join('\n')
        .trim();
    } else if (header.startsWith('opportunities')) {
      // Parse opportunities as ideas
      sectionContent.split('\n').forEach(line => {
        const match = line.match(/^-\s+\*\*([^*]+?)\*\*[:\s]*(.*)$/);
        if (match) {
          ideas.push({
            title: match[1].trim().replace(/:$/, ''),
            description: match[2].trim()
          });
        }
      });
    } else if (header.startsWith('resources')) {
      // Parse Projects subsection
      const projectsMatch = sectionContent.match(/\*\*Projects\*\*\s*([\s\S]*?)(?=\*\*Research\*\*|$)/i);
      if (projectsMatch) {
        projectsMatch[1].split('\n').forEach(line => {
          const match = line.trim().match(/^-?\s*\[([^\]]+)\]\(([^)]+)\)\s*[-–—:]?\s*(.*)$/);
          if (match) {
            projects.push({
              name: match[1].trim(),
              url: match[2].trim(),
              description: match[3].trim()
            });
          }
        });
      }

      // Parse Research subsection
      const researchMatch = sectionContent.match(/\*\*Research\*\*\s*([\s\S]*?)$/i);
      if (researchMatch) {
        researchMatch[1].split('\n').forEach(line => {
          const match = line.trim().match(/^-?\s*\[([^\]]+)\]\(([^)]+)\)\s*(?:\((\d{4})\))?\s*[-–—:]?\s*(.*)$/);
          if (match) {
            resources.push({
              title: match[1].trim(),
              link: match[2].trim(),
              year: match[3] || null,
              description: match[4]?.trim() || ''
            });
          }
        });
      }
    }
  });

  return {
    id,
    title,
    problemStatement,
    ideas,
    projects,
    resources
  };
}

function loadUsecases() {
  const dataDir = join(__dirname, 'public', 'data');
  const files = readdirSync(dataDir).filter(f => f.endsWith('.md'));

  usecases = files.map(file => {
    const id = file.replace('.md', '');
    return parseMarkdownFile(join(dataDir, file), id);
  });

  console.log(`Loaded ${usecases.length} use cases`);
}

// Load on startup
loadUsecases();

// API Endpoints

// GET /api/usecases - List all use cases (summary)
app.get('/api/usecases', (req, res) => {
  const summary = usecases.map(uc => ({
    id: uc.id,
    title: uc.title,
    problemStatement: uc.problemStatement.substring(0, 200) + '...',
    ideasCount: uc.ideas.length,
    projectsCount: uc.projects.length,
    resourcesCount: uc.resources.length
  }));
  res.json(summary);
});

// GET /api/usecases/:id - Get full use case by ID
app.get('/api/usecases/:id', (req, res) => {
  const usecase = usecases.find(uc => uc.id === req.params.id);
  if (!usecase) {
    return res.status(404).json({ error: 'Use case not found' });
  }
  res.json(usecase);
});

// GET /api/search?q=query - Search use cases
app.get('/api/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase().trim();

  if (!query) {
    return res.json([]);
  }

  const results = [];

  usecases.forEach(uc => {
    let matches = [];

    // Search in title
    if (uc.title.toLowerCase().includes(query)) {
      matches.push({ type: 'title', text: uc.title });
    }

    // Search in problem statement
    if (uc.problemStatement.toLowerCase().includes(query)) {
      matches.push({ type: 'problem', text: uc.problemStatement.substring(0, 150) + '...' });
    }

    // Search in ideas
    uc.ideas.forEach(idea => {
      if (idea.title.toLowerCase().includes(query) || idea.description.toLowerCase().includes(query)) {
        matches.push({ type: 'idea', text: idea.title });
      }
    });

    // Search in projects
    uc.projects.forEach(project => {
      if (project.name.toLowerCase().includes(query) || (project.description && project.description.toLowerCase().includes(query))) {
        matches.push({ type: 'project', text: project.name });
      }
    });

    // Search in resources
    uc.resources.forEach(resource => {
      if (resource.title.toLowerCase().includes(query) || (resource.description && resource.description.toLowerCase().includes(query))) {
        matches.push({ type: 'resource', text: resource.title });
      }
    });

    if (matches.length > 0) {
      results.push({
        id: uc.id,
        title: uc.title,
        matches: matches.slice(0, 5) // Limit matches per use case
      });
    }
  });

  res.json(results);
});

// Serve static files from dist
app.use(express.static(join(__dirname, 'dist')));

// SPA fallback - serve index.html for all non-API routes
app.get('/{*path}', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
