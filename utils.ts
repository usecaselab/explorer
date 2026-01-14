import { DomainData, Idea, Project, Resource, Bounty } from './types';

export const parseDomainMarkdown = (markdown: string, existingData: DomainData): DomainData => {
  const newData = { ...existingData };
  
  // Normalize newlines
  const text = markdown.replace(/\r\n/g, '\n');

  // Parse Title
  const titleMatch = text.match(/^#\s+(.+)$/m);
  if (titleMatch) newData.title = titleMatch[1].trim();

  // Split into sections based on ## headers
  const sections = text.split(/^##\s+/m);

  sections.forEach(section => {
    const lines = section.trim().split('\n');
    const header = lines[0].trim().toLowerCase();
    const content = lines.slice(1).join('\n').trim();

    if (header.startsWith('the opportunity') || header.startsWith('problem')) {
      newData.problemStatement = content;
    } else if (header.startsWith('ideas')) {
      newData.ideas = parseIdeas(content);
    } else if (header.startsWith('projects')) {
      newData.projects = parseProjects(content);
    } else if (header.startsWith('resources')) {
      newData.resources = parseResources(content);
    } else if (header.startsWith('bounties')) {
      newData.bounties = parseBounties(content);
    }
  });

  return newData;
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