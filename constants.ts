
import { DomainData } from './types';

// Initial empty state - populated via Markdown fetch in App.tsx
export const DOMAINS: DomainData[] = [
  { id: 'advocacy-and-rights', title: 'Advocacy & Rights', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'ai', title: 'AI', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'alt-money', title: 'Alternative Money', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'credit-and-capital-formation', title: 'Credit & Capital Formation', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'data', title: 'Data', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'education', title: 'Education', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'energy', title: 'Energy', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'environment', title: 'Environment', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'food-and-agriculture', title: 'Food & Agriculture', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'gaming-and-autonomous-worlds', title: 'Gaming & Autonomous Worlds', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'global-governance', title: 'Global Governance', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'hardware-and-iot', title: 'Hardware & IoT', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'health-and-bio', title: 'Health & Bio', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'insurance', title: 'Insurance', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'intellectual-property', title: 'Intellectual Property', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'it-infrastructure', title: 'IT Infrastructure', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'law-and-regulation', title: 'Law & Regulation', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'marketing-and-advertising', title: 'Marketing & Advertising', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'media-and-entertainment', title: 'Media & Entertainment', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'orgtech', title: 'OrgTech', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'philanthropy-and-social-services', title: 'Philanthropy & Social Services', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'productivity-and-collaboration', title: 'Productivity & Collaboration', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'public-administration', title: 'Public Administration', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'public-finance-and-procurement', title: 'Public Finance & Procurement', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'real-estate-and-housing', title: 'Real Estate & Housing', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'retail-and-ecommerce', title: 'Retail & Ecommerce', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'science-and-research', title: 'Science & Research', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'security-and-defense', title: 'Security & Defense', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'services-and-tasks', title: 'Services & Tasks', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'social', title: 'Social', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'supply-chain', title: 'Supply Chain', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'transport-and-logistics', title: 'Transport & Logistics', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] },
  { id: 'travel', title: 'Travel', problemStatement: "Loading...", ideas: [], projects: [], resources: [], discussion: [], funding: [], bounties: [] }
];

export const DOMAIN_IDS = [
  "Advocacy & Rights",
  "AI",
  "Alternative Money",
  "Credit & Capital Formation",
  "Data",
  "Education",
  "Energy",
  "Environment",
  "Food & Agriculture",
  "Gaming & Autonomous Worlds",
  "Global Governance",
  "Hardware & IoT",
  "Health & Bio",
  "Insurance",
  "Intellectual Property",
  "IT Infrastructure",
  "Law & Regulation",
  "Marketing & Advertising",
  "Media & Entertainment",
  "OrgTech",
  "Philanthropy & Social Services",
  "Productivity & Collaboration",
  "Public Administration",
  "Public Finance & Procurement",
  "Real Estate & Housing",
  "Retail & Ecommerce",
  "Science & Research",
  "Security & Defense",
  "Services & Tasks",
  "Social",
  "Supply Chain",
  "Transport & Logistics",
  "Travel"
];

export const DOMAIN_CATEGORIES: Record<string, string[]> = {
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
    "Retail & Ecommerce",
    "Services & Tasks",
    "Travel",
    "Social",
    "Media & Entertainment"
  ],
  "Enterprise": [
    "OrgTech",
    "Supply Chain",
    "Transport & Logistics",
    "Productivity & Collaboration",
    "Intellectual Property",
    "Marketing & Advertising"
  ],
  "Digital": [
    "AI",
    "Data",
    "Gaming & Autonomous Worlds",
    "Hardware & IoT",
    "IT Infrastructure"
  ],
  "Physical": [
    "Energy",
    "Food & Agriculture",
    "Real Estate & Housing",
    "Environment",
    "Health & Bio"
  ]
};
