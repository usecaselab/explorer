export interface Resource {
  name: string;
  description: string;
  url: string;
}

export interface IdeaEntry {
  id: string;
  title: string;
  problem: string;
  solutionSketch: string;
  targetUser: string;
  whyEthereum: string;
  domainId: string;
  domainTitle: string;
  resources: Resource[];
}
