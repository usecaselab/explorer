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
  whyEthereum: string;
  domains: string[];
  resources: Resource[];
  examples?: Resource[];
}
