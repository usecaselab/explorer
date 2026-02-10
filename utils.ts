import { DomainData, Idea, Project, Resource, Bounty } from './types';
import React from 'react';

// Render text with markdown formatting (links, bold, italic) as React elements
export const renderMarkdownLinks = (text: string): (string | React.ReactElement)[] => {
  if (!text) return [''];

  const parts: (string | React.ReactElement)[] = [];
  // Combined regex for links, bold, and italic
  // Order matters: check links first, then bold (**text**), then italic (*text*)
  const markdownRegex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let lastIndex = 0;
  let match;
  let keyCounter = 0;

  while ((match = markdownRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    if (match[1] !== undefined && match[2] !== undefined) {
      // Link: [text](url)
      parts.push(
        React.createElement('a', {
          key: `link-${keyCounter++}`,
          href: match[2],
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'text-blue-600 hover:underline break-words'
        }, match[1])
      );
    } else if (match[3] !== undefined) {
      // Bold: **text**
      parts.push(
        React.createElement('strong', {
          key: `bold-${keyCounter++}`,
          className: 'font-semibold'
        }, match[3])
      );
    } else if (match[4] !== undefined) {
      // Italic: *text*
      parts.push(
        React.createElement('em', {
          key: `italic-${keyCounter++}`
        }, match[4])
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last match
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};

// Decode common HTML entities to their character equivalents
const decodeHtmlEntities = (text: string): string => {
  const entities: Record<string, string> = {
    '&mdash;': '\u2014',
    '&ndash;': '\u2013',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&hellip;': '\u2026',
    '&lsquo;': '\u2018',
    '&rsquo;': '\u2019',
    '&ldquo;': '\u201C',
    '&rdquo;': '\u201D',
  };
  return text.replace(/&(?:mdash|ndash|amp|lt|gt|quot|apos|hellip|lsquo|rsquo|ldquo|rdquo|#39);/g,
    (match) => entities[match] || match);
};

export const parseDomainMarkdown = (markdown: string, existingData: DomainData): DomainData => {
  const newData = { ...existingData };

  // Normalize newlines and decode HTML entities
  const text = decodeHtmlEntities(markdown.replace(/\r\n/g, '\n'));

  // Parse YAML frontmatter for title
  const frontmatterMatch = text.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
    if (titleMatch) {
      newData.title = titleMatch[1].trim();
    }
  }

  // Remove frontmatter from text for section parsing
  const bodyText = text.replace(/^---\n[\s\S]*?\n---\n*/, '');

  // Split into sections based on ## headers
  const sections = bodyText.split(/^##\s+/m);

  let allIdeas: Idea[] = [];
  let allProjects: Project[] = [];
  let allResources: Resource[] = [];

  sections.forEach(section => {
    if (!section.trim()) return;

    const lines = section.trim().split('\n');
    const header = lines[0].trim().toLowerCase();
    const content = lines.slice(1).join('\n').trim();

    if (header.startsWith('the opportunity')) {
      newData.problemStatement = content.trim();
    } else if (header.startsWith('ideas')) {
      // Parse ideas with format: - idea name - description
      allIdeas = [...allIdeas, ...parseIdeasBulletFormat(content)];
    } else if (header.startsWith('examples')) {
      // Parse projects with format: - [name](url) - description
      allProjects = [...allProjects, ...parseProjectsBulletFormat(content)];
    } else if (header.startsWith('resources')) {
      // Parse resources with format: - [title](link) (year) - description
      allResources = [...allResources, ...parseResourcesBulletFormat(content)];
    } else if (header.startsWith('bounties')) {
      newData.bounties = parseBounties(content);
    }
  });

  newData.ideas = allIdeas;
  newData.projects = allProjects;
  newData.resources = allResources;

  return newData;
};

// Parse ideas in new bullet format: - idea name - description OR - plain idea text
const parseIdeasBulletFormat = (text: string): Idea[] => {
  const ideas: Idea[] = [];
  const lines = text.split('\n');

  lines.forEach(line => {
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
      // Fallback: plain bullet point without separator - use full text as title
      const plainMatch = trimmedLine.match(/^-\s+(.+)$/);
      if (plainMatch && plainMatch[1].trim()) {
        ideas.push({
          title: plainMatch[1].trim(),
          description: ''
        });
      }
    }
  });

  return ideas;
};

// Parse projects in new bullet format: - [name](url) - description
const parseProjectsBulletFormat = (text: string): Project[] => {
  const projects: Project[] = [];
  const lines = text.split('\n');

  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    // Match: - [Name](url) - Description or - [Name](url) Description
    const match = trimmedLine.match(/^-?\s*\[([^\]]+)\]\(([^)]+)\)\s*[-–—:]?\s*(.*)$/);
    if (match) {
      projects.push({
        name: match[1].trim(),
        url: match[2].trim(),
        description: match[3].trim(),
        status: 'active'
      });
    }
  });

  return projects;
};

// Parse resources in new bullet format: - [title](link) (year) - description
const parseResourcesBulletFormat = (text: string): Resource[] => {
  const resources: Resource[] = [];
  const lines = text.split('\n');

  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    // Match: - [Title](url) (year) - Description
    const match = trimmedLine.match(/^-?\s*\[([^\]]+)\]\(([^)]+)\)\s*(?:\((\d{4})\))?\s*[-–—:]?\s*(.*)$/);
    if (match) {
      resources.push({
        title: match[1].trim(),
        link: match[2].trim(),
        year: match[3] || undefined,
        description: match[4]?.trim() || ''
      });
    }
  });

  return resources;
};

// Parse bullet points from Opportunities section as ideas
const parseOpportunitiesAsIdeas = (text: string): Idea[] => {
  const ideas: Idea[] = [];
  const lines = text.split('\n');

  lines.forEach(line => {
    const trimmedLine = line.trim();

    // Skip empty lines, headers, blockquotes, horizontal rules
    if (!trimmedLine || trimmedLine.startsWith('---') || trimmedLine.startsWith('> ') || trimmedLine.startsWith('#')) {
      return;
    }

    // Handle bullet points (both top-level and sub-bullets)
    // Match lines starting with -, *, or indented bullets
    const bulletMatch = trimmedLine.match(/^[-*]\s+(.+)$/);
    if (!bulletMatch) {
      return;
    }

    const content = bulletMatch[1].trim();
    if (!content) return;

    // Pattern 1: Bold titles - **Title:** Description or - **Title** Description
    const boldMatch = content.match(/^\*\*([^*]+?)\*\*[:\s]*(.*)$/);
    if (boldMatch) {
      let title = boldMatch[1].trim();
      if (title.endsWith(':')) {
        title = title.slice(0, -1).trim();
      }
      ideas.push({
        title,
        description: boldMatch[2].trim()
      });
      return;
    }

    // Pattern 2: Plain text with colon separator - Title: Description
    // Be more lenient with title length
    const colonMatch = content.match(/^([^:]+):\s+(.+)$/);
    if (colonMatch && colonMatch[1].length < 100 && colonMatch[1].length > 3) {
      ideas.push({
        title: colonMatch[1].trim(),
        description: colonMatch[2].trim()
      });
      return;
    }

    // Pattern 3: Plain text with dash/em-dash separator - Title - Description
    const dashMatch = content.match(/^([^–—-]{5,60})\s*[–—-]\s+(.{10,})$/);
    if (dashMatch) {
      ideas.push({
        title: dashMatch[1].trim(),
        description: dashMatch[2].trim()
      });
      return;
    }

    // Pattern 4: Plain text without clear separator
    if (content.length >= 10) {
      // Try to find a natural break point (first sentence)
      const sentenceMatch = content.match(/^([^.!?]+[.!?])\s*(.*)$/);
      if (sentenceMatch && sentenceMatch[1].length < 120 && sentenceMatch[1].length > 10) {
        ideas.push({
          title: sentenceMatch[1].trim(),
          description: sentenceMatch[2].trim()
        });
      } else if (content.length <= 200) {
        // Use the whole content as the title
        ideas.push({
          title: content,
          description: ''
        });
      } else {
        // For very long content, truncate for title
        ideas.push({
          title: content.substring(0, 100) + '...',
          description: content
        });
      }
    }
  });

  return ideas;
};

// Parse intervention ideas (bullet points or prose)
// Handles nested sub-bullets by joining them to the parent idea's description
const parseInterventionIdeas = (text: string): Idea[] => {
  const ideas: Idea[] = [];
  const lines = text.split('\n');

  // First pass: group top-level bullets with their sub-bullets
  const groups: { main: string; subs: string[] }[] = [];
  let currentGroup: { main: string; subs: string[] } | null = null;

  lines.forEach(line => {
    // Check if this is a top-level bullet (no leading whitespace)
    const isTopLevel = line.match(/^-\s+(.+)$/);
    // Check if this is an indented sub-bullet
    const isSubBullet = line.match(/^\s+-\s+(.+)$/);

    if (isTopLevel) {
      // Save previous group if exists
      if (currentGroup) {
        groups.push(currentGroup);
      }
      currentGroup = { main: isTopLevel[1].trim(), subs: [] };
    } else if (isSubBullet && currentGroup) {
      // Add sub-bullet content to current group
      currentGroup.subs.push(isSubBullet[1].trim());
    }
  });

  // Don't forget the last group
  if (currentGroup) {
    groups.push(currentGroup);
  }

  // Second pass: convert groups to ideas
  groups.forEach(group => {
    const content = group.main;
    // Join sub-bullets as additional description
    const subContent = group.subs.join(' ');

    // Extract title if bold text exists anywhere in the line
    const boldMatch = content.match(/^(.*?)\*\*([^*]+)\*\*[:\s]*(.*)/);
    if (boldMatch) {
      const prefix = boldMatch[1].trim();
      const boldText = boldMatch[2].trim();
      const suffix = [boldMatch[3].trim(), subContent].filter(Boolean).join(' ');
      ideas.push({
        title: prefix ? `${prefix} ${boldText}` : boldText,
        description: suffix
      });
    } else if (content.length > 10) {
      // Only split on colon followed by space (not dashes, which break markdown links and bold)
      const colonMatch = content.match(/^([^:]+):\s+(.+)$/);
      if (colonMatch && colonMatch[1].length < 80 && colonMatch[1].length > 5) {
        ideas.push({
          title: colonMatch[1].trim(),
          description: [colonMatch[2].trim(), subContent].filter(Boolean).join(' ')
        });
      } else {
        // Try to find a natural sentence break
        const sentenceMatch = content.match(/^([^.!?]+[.!?])\s*(.*)$/);
        if (sentenceMatch && sentenceMatch[1].length < 120 && sentenceMatch[1].length > 10) {
          ideas.push({
            title: sentenceMatch[1].trim(),
            description: [sentenceMatch[2].trim(), subContent].filter(Boolean).join(' ')
          });
        } else {
          // Check if content contains a markdown link - extract link text for title
          const linkMatch = content.match(/^(.*?)\[([^\]]+)\]\([^)]+\)(.*)$/);
          if (linkMatch) {
            // Combine prefix + link text + suffix as title (without the URL)
            const titleParts = [linkMatch[1].trim(), linkMatch[2].trim(), linkMatch[3].trim()].filter(Boolean);
            ideas.push({
              title: titleParts.join(' '),
              description: subContent
            });
          } else {
            // Use full content with sub-bullets as description
            const fullDescription = [content, subContent].filter(Boolean).join(' ');
            ideas.push({
              title: content.substring(0, 80) + (content.length > 80 ? '...' : ''),
              description: fullDescription
            });
          }
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
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('**')) return;

      // Pattern 1: Standard format - [Name](url) - Description
      const standardMatch = trimmedLine.match(/^-?\s*\[([^\]]+)\]\(([^)]+)\)\s*[-–—:]?\s*(.*)$/);
      if (standardMatch) {
        const name = standardMatch[1].trim();
        const url = standardMatch[2].trim();
        let description = standardMatch[3].trim();

        // Determine status from description or name hints
        let status: 'active' | 'dead' | 'beta' = 'active';
        const fullText = (name + ' ' + description).toLowerCase();
        if (fullText.includes('[dead]') || fullText.includes('(dead)') || fullText.includes('(defunct)')) {
          status = 'dead';
          description = description.replace(/\[dead\]/gi, '').replace(/\(dead\)/gi, '').replace(/\(defunct\)/gi, '').trim();
        } else if (fullText.includes('[beta]') || fullText.includes('(beta)') || fullText.includes('(wip)')) {
          status = 'beta';
          description = description.replace(/\[beta\]/gi, '').replace(/\(beta\)/gi, '').replace(/\(wip\)/gi, '').trim();
        }

        projects.push({ name, url, description, status });
        return;
      }

      // Pattern 2: Category with multiple links - "Category - [link1](...), [link2](...)"
      const categoryMatch = trimmedLine.match(/^-?\s*([^-\[]+?)\s*[-–—]\s*(.*\[.+\]\(.+\).*)$/);
      if (categoryMatch) {
        const category = categoryMatch[1].trim();
        const linksText = categoryMatch[2];

        // Extract all [name](url) pairs from the text
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let linkMatch;
        let foundLinks = false;

        while ((linkMatch = linkRegex.exec(linksText)) !== null) {
          foundLinks = true;
          let name = linkMatch[1].trim();
          const url = linkMatch[2].trim();

          // Determine status
          let status: 'active' | 'dead' | 'beta' = 'active';
          if (name.toLowerCase().includes('[dead]') || linksText.toLowerCase().includes('(dead)')) {
            status = 'dead';
            name = name.replace(/\s*\[dead\]/gi, '').trim();
          }

          projects.push({
            name,
            url,
            description: category,
            status
          });
        }

        if (foundLinks) return;
      }

      // Pattern 3: Plain text without link - "Name (Company) - Description"
      const plainMatch = trimmedLine.match(/^-?\s*([^-]+?)\s+[-–—]\s+(.+)$/);
      if (plainMatch && !plainMatch[1].includes('[') && plainMatch[1].length < 80) {
        projects.push({
          name: plainMatch[1].trim(),
          url: undefined,
          description: plainMatch[2].trim(),
          status: 'active'
        });
        return;
      }

      // Pattern 4: Indented sub-item (starts with spaces or tabs after dash)
      if (line.match(/^\s{2,}-?\s*\[/)) {
        const subMatch = trimmedLine.match(/^-?\s*\[([^\]]+)\]\(([^)]+)\)\s*[-–—:]?\s*(.*)$/);
        if (subMatch) {
          projects.push({
            name: subMatch[1].trim(),
            url: subMatch[2].trim(),
            description: subMatch[3].trim(),
            status: 'active'
          });
        }
      }
    });
  }

  if (researchMatch) {
    const researchLines = researchMatch[1].split('\n');
    researchLines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('**')) return;

      // Match: - [Title](url) (year) - Description
      // Year can be in parentheses like (2023) or (2024)
      const match = trimmedLine.match(/^-?\s*\[([^\]]+)\]\(([^)]+)\)\s*(?:\((\d{4})\))?\s*[-–—:]?\s*(.*)$/);
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