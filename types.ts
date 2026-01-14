export interface Project {
  name: string;
  description: string;
  status: 'active' | 'dead' | 'beta';
  url?: string;
  logo?: string;
}

export interface Resource {
  title: string;
  year?: string;
  description: string;
  link: string;
}

export interface Comment {
  id: string;
  user: string;
  text: string;
  replyTo?: string;
  timestamp: string;
}

export interface FundingOpportunity {
  id: string;
  title: string;
  organization: string;
  amount: string;
  description: string;
  link: string;
  deadline?: string;
  type: 'grant' | 'bounty' | 'hackathon' | 'vc';
}

export interface Idea {
  title: string;
  description: string;
}

export interface Bounty {
  title: string;
  amount: string;
  status: 'Open' | 'Closed' | 'In Progress';
  description: string;
  url?: string;
}

export interface Update {
  id: string;
  author: {
    name: string;
    handle: string;
    avatarSeed: string;
  };
  content: string;
  timestamp: string; // ISO string
  likes: number;
  comments: number;
  type: 'project' | 'research' | 'community';
}

export interface DomainData {
  id: string;
  title: string;
  problemStatement: string;
  ideas: Idea[];
  projects: Project[];
  resources: Resource[];
  discussion: Comment[];
  funding: FundingOpportunity[];
  bounties: Bounty[];
  updates?: Update[];
}