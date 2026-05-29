export interface Idea {
  id: string;
  title: string;
  domains: string[];
  // Persona desires this idea fulfills, as `personaId/desireId` refs. The
  // single source of truth for the persona ↔ idea graph (see
  // scripts/build-ideas.mjs: attachIdeasToDesires).
  desires: string[];
  problem: string;
  solutionSketch: string;
  whyEthereum: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface Portrait {
  name: string;
  role: string;
  location: string;
  icon: string;
}

export interface Desire {
  id: string;
  title: string;
  framing: string;
  ideas: string[];
}

export interface RelatedPersona {
  id: string;
  name: string;
  shared: number;
}

export interface Persona {
  id: string;
  name: string;
  portraits: Portrait[];
  desires: Desire[];
  related: RelatedPersona[];
}

let ideaCache: Idea[] | null = null;
let personaCache: Persona[] | null = null;

export async function fetchAllIdeas(): Promise<Idea[]> {
  if (ideaCache) return ideaCache;
  const res = await fetch(`${import.meta.env.BASE_URL}ideas.json`);
  if (!res.ok) throw new Error(`Failed to load ideas.json: ${res.status}`);
  ideaCache = (await res.json()) as Idea[];
  return ideaCache;
}

export async function fetchAllPersonas(): Promise<Persona[]> {
  if (personaCache) return personaCache;
  const res = await fetch(`${import.meta.env.BASE_URL}personas.json`);
  if (!res.ok) throw new Error(`Failed to load personas.json: ${res.status}`);
  personaCache = (await res.json()) as Persona[];
  return personaCache;
}

export async function fetchPersona(id: string): Promise<Persona | null> {
  const all = await fetchAllPersonas();
  return all.find((p) => p.id === id) || null;
}

// Find which (persona, desire) pairs reference a given idea.
// Used by the idea page to show "Appears for: persona → desire".
export interface IdeaAppearance {
  personaId: string;
  personaName: string;
  desireId: string;
  desireTitle: string;
}

export async function appearancesForIdea(ideaId: string): Promise<IdeaAppearance[]> {
  const personas = await fetchAllPersonas();
  const out: IdeaAppearance[] = [];
  for (const p of personas) {
    for (const d of p.desires) {
      if (d.ideas.includes(ideaId)) {
        out.push({
          personaId: p.id,
          personaName: p.name,
          desireId: d.id,
          desireTitle: d.title,
        });
      }
    }
  }
  return out;
}
