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
let markdownContent = {}; // Store raw markdown by id

// Domain categories mapping
const DOMAIN_CATEGORIES = {
  "Society": [
    "Advocacy & Rights",
    "Global Governance",
    "Education",
    "Law & Regulation",
    "Public Administration",
    "Philanthropy & Social Services",
    "Security & Defense",
    "Science & Research"
  ],
  "Finance": [
    "Alternative Money",
    "Credit & Capital Formation",
    "Insurance",
    "Public Finance & Procurement"
  ],
  "Consumer": [
    "Retail & eCommerce",
    "Services & Tasks",
    "Travel",
    "Social",
    "Media & Entertainment",
    "Gaming & Autonomous Worlds"
  ],
  "Enterprise": [
    "Business Ops",
    "Supply Chain",
    "Transport & Logistics",
    "Productivity & Collaboration",
    "Intellectual Property",
    "Marketing & Advertising"
  ],
  "Digital": [
    "AI",
    "Data",
    "IT Infrastructure",
    "Hardware & IoT"
  ],
  "Physical": [
    "Energy",
    "Food & Agriculture",
    "Real Estate & Housing",
    "Sustainability & Regeneration",
    "Health & Bio"
  ]
};

function parseMarkdownFile(filePath, id) {
  const content = readFileSync(filePath, 'utf8');
  // Store raw markdown
  markdownContent[id] = content;
  const text = content.replace(/\r\n/g, '\n');

  // Parse YAML frontmatter
  let title = id;
  let sector = '';
  const frontmatterMatch = text.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
    const sectorMatch = frontmatter.match(/^sector:\s*(.+)$/m);
    if (titleMatch) title = titleMatch[1].trim();
    if (sectorMatch) sector = sectorMatch[1].trim();
  }

  // Remove frontmatter from text for section parsing
  const bodyText = text.replace(/^---\n[\s\S]*?\n---\n*/, '');

  // Split into sections by ## headers
  const sections = bodyText.split(/^##\s+/m);

  let problemStatement = '';
  let ideas = [];
  let projects = [];
  let resources = [];

  sections.forEach(section => {
    if (!section.trim()) return;

    const lines = section.trim().split('\n');
    const header = lines[0].trim().toLowerCase();
    const sectionContent = lines.slice(1).join('\n').trim();

    if (header.startsWith('the opportunity')) {
      problemStatement = sectionContent.trim();
    } else if (header.startsWith('ideas')) {
      // Parse ideas with format: - idea name - description OR plain bullet points
      sectionContent.split('\n').forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine || !trimmedLine.startsWith('-')) return;

        // First try format: - idea name - description (use " - " as delimiter)
        const match = trimmedLine.match(/^-\s+(.+?)\s+-\s+(.+)$/);
        if (match) {
          ideas.push({
            title: match[1].trim(),
            description: match[2].trim()
          });
        } else {
          // Fallback: plain bullet point without separator
          const plainMatch = trimmedLine.match(/^-\s+(.+)$/);
          if (plainMatch && plainMatch[1].trim()) {
            ideas.push({
              title: plainMatch[1].trim(),
              description: ''
            });
          }
        }
      });
    } else if (header.startsWith('projects')) {
      // Parse projects section
      sectionContent.split('\n').forEach(line => {
        const match = line.trim().match(/^-?\s*\[([^\]]+)\]\(([^)]+)\)\s*[-–—:]?\s*(.*)$/);
        if (match) {
          projects.push({
            name: match[1].trim(),
            url: match[2].trim(),
            description: match[3].trim()
          });
        }
      });
    } else if (header.startsWith('resources')) {
      // Parse resources with format: - [title](link) (year) - description
      sectionContent.split('\n').forEach(line => {
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
  });

  return {
    id,
    title,
    sector,
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

// GET /api/categories - Get all categories with their domains
app.get('/api/categories', (req, res) => {
  // Build category response with domain details
  const categories = {};

  for (const [category, domainTitles] of Object.entries(DOMAIN_CATEGORIES)) {
    categories[category] = domainTitles.map(title => {
      const usecase = usecases.find(uc => uc.title === title);
      const problemStatement = usecase?.problemStatement || '';
      return {
        id: usecase?.id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: title,
        problemStatement: problemStatement ? problemStatement.substring(0, 200) + '...' : '',
        ideasCount: usecase?.ideas?.length || 0,
        projectsCount: usecase?.projects?.length || 0,
        resourcesCount: usecase?.resources?.length || 0
      };
    });
  }

  res.json(categories);
});

// GET /api/usecases/:id/markdown - Get raw markdown for a use case
app.get('/api/usecases/:id/markdown', (req, res) => {
  const id = req.params.id;
  const markdown = markdownContent[id];

  if (!markdown) {
    return res.status(404).json({ error: 'Use case not found' });
  }

  res.json({ id, markdown });
});

// GET /api/markdown - Get all raw markdown content
app.get('/api/markdown', (req, res) => {
  const all = usecases.map(uc => ({
    id: uc.id,
    title: uc.title,
    markdown: markdownContent[uc.id]
  }));
  res.json(all);
});

// GET /api/usecases - List all use cases (summary)
app.get('/api/usecases', (req, res) => {
  const summary = usecases.map(uc => ({
    id: uc.id,
    title: uc.title,
    sector: uc.sector,
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
