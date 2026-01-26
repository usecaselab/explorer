import { DomainData, Idea, Project, Resource, Bounty } from './types';

export const parseDomainMarkdown = (markdown: string, existingData: DomainData): DomainData => {
  const newData = { ...existingData };

  // Normalize newlines
  const text = markdown.replace(/\r\n/g, '\n');

  // Parse Title - first # header that's not followed by Problem/Opportunities/Resources etc.
  const titleMatch = text.match(/^#\s+([^*\n]+)$/m);
  if (titleMatch && !titleMatch[1].toLowerCase().startsWith('problem') &&
      !titleMatch[1].toLowerCase().startsWith('opportunities') &&
      !titleMatch[1].toLowerCase().startsWith('resources')) {
    newData.title = titleMatch[1].trim();
  }

  // Split into sections based on #, ##, or ### headers (1-3 hash marks)
  const sections = text.split(/^#{1,3}\s+/m);

  let allIdeas: Idea[] = [];
  let allProjects: Project[] = [];
  let allResources: Resource[] = [];

  sections.forEach(section => {
    const lines = section.trim().split('\n');
    // Remove bold markers from header (e.g., "**Opportunities**" -> "opportunities")
    const header = lines[0].trim().replace(/\*\*/g, '').toLowerCase();
    const content = lines.slice(1).join('\n').trim();

    if (header.startsWith('the opportunity') || header.startsWith('problem')) {
      // Remove metadata lines (Categories:, Last edited time:) and horizontal rules
      const cleanContent = content
        .split('\n')
        .filter(line => !line.startsWith('Categories:') && !line.startsWith('Last edited time:') && line.trim() !== '---')
        .join('\n')
        .trim();
      newData.problemStatement = cleanContent;
    } else if (header.startsWith('ideas')) {
      allIdeas = [...allIdeas, ...parseIdeas(content)];
    } else if (header.startsWith('opportunities')) {
      // Parse opportunities as ideas (bullet point format)
      allIdeas = [...allIdeas, ...parseOpportunitiesAsIdeas(content)];
    } else if (header.startsWith('intervention ideas')) {
      // Parse intervention ideas as ideas
      allIdeas = [...allIdeas, ...parseInterventionIdeas(content)];
    } else if (header.startsWith('projects')) {
      allProjects = [...allProjects, ...parseProjects(content)];
    } else if (header.startsWith('resources')) {
      // Notion format: Resources section contains **Projects** and **Research** subsections
      const parsed = parseNotionResources(content);
      allProjects = [...allProjects, ...parsed.projects];
      allResources = [...allResources, ...parsed.resources];
    } else if (header.startsWith('bounties')) {
      newData.bounties = parseBounties(content);
    }
  });

  newData.ideas = allIdeas;
  newData.projects = allProjects;
  newData.resources = allResources;

  return newData;
};

// Parse bullet points from Opportunities section as ideas
const parseOpportunitiesAsIdeas = (text: string): Idea[] => {
  const ideas: Idea[] = [];

  // First check if there's intro text before the bullet points
  const lines = text.split('\n');

  lines.forEach(line => {
    // Match bullet points with bold titles: - **Title:** Description or - **Title** Description
    const boldMatch = line.match(/^-\s+\*\*([^*:]+)\*\*[:\s]*(.*)$/);
    if (boldMatch) {
      ideas.push({
        title: boldMatch[1].trim(),
        description: boldMatch[2].trim()
      });
    }
  });

  return ideas;
};

// Parse intervention ideas (bullet points or prose)
const parseInterventionIdeas = (text: string): Idea[] => {
  const ideas: Idea[] = [];
  const lines = text.split('\n');

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('-') && trimmed.length > 2) {
      // Remove the leading dash and any bold markers
      let content = trimmed.substring(1).trim();
      // Extract title if bold
      const boldMatch = content.match(/^\*\*([^*]+)\*\*[:\s]*(.*)/);
      if (boldMatch) {
        ideas.push({
          title: boldMatch[1].trim(),
          description: boldMatch[2].trim()
        });
      } else if (content.length > 10) {
        // Use first part as title if no bold
        const parts = content.split(/[:\-–—]/);
        if (parts.length > 1 && parts[0].length < 60) {
          ideas.push({
            title: parts[0].trim(),
            description: parts.slice(1).join(' ').trim()
          });
        } else {
          ideas.push({
            title: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
            description: content
          });
        }
      }
    }
  });

  return ideas;
};

// Parse Notion Resources section with **Projects** and **Research** subsections
const parseNotionResources = (text: string): { projects: Project[], resources: Resource[] } => {
  const projects: Project[] = [];
  const resources: Resource[] = [];

  // Split by **Projects** and **Research** headers
  const projectsMatch = text.match(/\*\*Projects\*\*\s*([\s\S]*?)(?=\*\*Research\*\*|$)/i);
  const researchMatch = text.match(/\*\*Research\*\*\s*([\s\S]*?)$/i);

  if (projectsMatch) {
    const projectLines = projectsMatch[1].split('\n');
    projectLines.forEach(line => {
      // Match: - [Name](url) - Description or [Name](url) - Description
      const match = line.match(/^-?\s*\[([^\]]+)\]\(([^)]+)\)\s*[-–—:]?\s*(.*)$/);
      if (match) {
        const name = match[1].trim();
        const url = match[2].trim();
        let description = match[3].trim();

        // Determine status from description hints
        let status: 'active' | 'dead' | 'beta' = 'active';
        if (description.toLowerCase().includes('(dead)') || description.toLowerCase().includes('(defunct)')) {
          status = 'dead';
          description = description.replace(/\(dead\)/gi, '').replace(/\(defunct\)/gi, '').trim();
        } else if (description.toLowerCase().includes('(beta)') || description.toLowerCase().includes('(wip)')) {
          status = 'beta';
          description = description.replace(/\(beta\)/gi, '').replace(/\(wip\)/gi, '').trim();
        }

        projects.push({ name, url, description, status });
      }
    });
  }

  if (researchMatch) {
    const researchLines = researchMatch[1].split('\n');
    researchLines.forEach(line => {
      // Match: - [Title](url) (year) - Description
      const match = line.match(/^-?\s*\[([^\]]+)\]\(([^)]+)\)\s*(?:\(([^)]+)\))?\s*[-–—:]?\s*(.*)$/);
      if (match) {
        resources.push({
          title: match[1].trim(),
          link: match[2].trim(),
          year: match[3]?.trim(),
          description: match[4]?.trim() || ''
        });
      }
    });
  }

  // Also try parsing as flat list if no subsections found
  if (projects.length === 0 && resources.length === 0) {
    const lines = text.split('\n');
    lines.forEach(line => {
      const match = line.match(/^-?\s*\[([^\]]+)\]\(([^)]+)\)\s*(?:\(([^)]+)\))?\s*[-–—:]?\s*(.*)$/);
      if (match) {
        const year = match[3]?.trim();
        // If it has a 4-digit year, treat as resource; otherwise as project
        if (year && /^\d{4}$/.test(year)) {
          resources.push({
            title: match[1].trim(),
            link: match[2].trim(),
            year,
            description: match[4]?.trim() || ''
          });
        } else {
          projects.push({
            name: match[1].trim(),
            url: match[2].trim(),
            description: (match[3] ? `(${match[3]}) ` : '') + (match[4]?.trim() || ''),
            status: 'active'
          });
        }
      }
    });
  }

  return { projects, resources };
};

const parseIdeas = (text: string): Idea[] => {
  const ideas: Idea[] = [];
  // Split by H3 headers (### Idea Title)
  const items = text.split(/^###\s+/m).slice(1);

  items.forEach(item => {
    const lines = item.trim().split('\n');
    const title = lines[0].trim();

    // Parse description, ignoring legacy metadata lines if present
    const contentLines: string[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      // Filter out old metadata lines if they exist in MD, though we are removing them from source
      if (!line.toLowerCase().startsWith('- difficulty:') && !line.toLowerCase().startsWith('- tags:') && line !== '') {
        contentLines.push(line);
      }
    }
    const description = contentLines.join(' ').trim();
    
    if (title) {
        ideas.push({ title, description });
    }
  });
  return ideas;
};

const parseProjects = (text: string): Project[] => {
  const projects: Project[] = [];
  const items = text.split(/^###\s+/m).slice(1);

  items.forEach(item => {
    const lines = item.trim().split('\n');
    const name = lines[0].trim();
    let status: 'active' | 'dead' | 'beta' = 'active';
    let url: string | undefined;

    const contentLines: string[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.toLowerCase().startsWith('- status:')) {
        const val = line.split(':')[1].trim().toLowerCase();
        if (['active', 'dead', 'beta'].includes(val)) status = val as any;
      } else if (line.toLowerCase().startsWith('- url:')) {
         // Remove "- url:" prefix
         url = line.substring(5).trim();
      } else if (line !== '') {
        contentLines.push(line);
      }
    }
    const description = contentLines.join(' ').trim();
    
    if (name) {
        projects.push({ name, description, status, url });
    }
  });
  return projects;
};

const parseBounties = (text: string): Bounty[] => {
  const bounties: Bounty[] = [];
  const items = text.split(/^###\s+/m).slice(1);

  items.forEach(item => {
    const lines = item.trim().split('\n');
    const title = lines[0].trim();
    let amount = '';
    let status: 'Open' | 'Closed' | 'In Progress' = 'Open';
    let url: string | undefined;

    const contentLines: string[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.toLowerCase().startsWith('- amount:')) {
        amount = line.substring(9).trim();
      } else if (line.toLowerCase().startsWith('- status:')) {
        const val = line.substring(9).trim();
        if (['Open', 'Closed', 'In Progress'].includes(val)) status = val as any;
      } else if (line.toLowerCase().startsWith('- url:')) {
        url = line.substring(5).trim();
      } else if (line !== '') {
        contentLines.push(line);
      }
    }
    const description = contentLines.join(' ').trim();
    
    if (title) {
        bounties.push({ title, amount, status, description, url });
    }
  });
  return bounties;
};

const parseResources = (text: string): Resource[] => {
  const resources: Resource[] = [];
  // Expect format: - [Title](Link) (Year) - Description
  // Regex handles optional Year: (YYYY)
  // Handles separator: - or :
  
  const lines = text.split('\n');
  lines.forEach(line => {
    const match = line.match(/-\s+\[([^\]]+)\]\(([^\)]+)\)\s*(?:\(([^)]+)\))?\s*[-:]\s*(.+)/);
    if (match) {
      resources.push({
        title: match[1],
        link: match[2],
        year: match[3] || undefined,
        description: match[4]
      });
    }
  });
  return resources;
};