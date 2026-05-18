export interface Idea {
  id: string;
  title: string;
  domains: string[];
  problem: string;
  solutionSketch: string;
  whyEthereum: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

let cache: Idea[] | null = null;

export async function fetchAllIdeas(): Promise<Idea[]> {
  if (cache) return cache;
  const res = await fetch(`${import.meta.env.BASE_URL}ideas.json`);
  if (!res.ok) throw new Error(`Failed to load ideas.json: ${res.status}`);
  cache = (await res.json()) as Idea[];
  return cache;
}
