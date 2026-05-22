import {
  Armchair, Bike, BookOpen, Briefcase, Building2, Car, Code, Coffee, Cpu,
  Factory, Film, FlaskConical, Gamepad2, GitBranch, GraduationCap,
  HandHeart, HardHat, HeartPulse, House, Key, Landmark, Laptop,
  Mic, Microscope, Music, Newspaper, Package, Palette, PenLine,
  PenTool, Pill, Rocket, Scale, School, ShoppingBag, Smartphone,
  Sprout, Star, Store, Terminal, Tractor, TrendingUp, Truck, User, Users,
  Utensils, Video, Vote, Wheat, Wrench, type LucideIcon,
} from 'lucide-react';

// Per-persona accent colors used on landing cards and persona pages.
// Colors are pulled from the existing domain palette so the visual language
// stays consistent with the idea pages.

export const PERSONA_COLOR: Record<string, string> = {
  // Earners / makers
  'creator': '#EC4899',
  'freelance-professional': '#7C3AED',
  'gig-worker': '#F97316',
  'oss-maintainer': '#4F46E5',
  'researcher': '#2563EB',
  'farmer': '#84CC16',
  // Money users
  'investor': '#15803D',
  'shopper': '#F97316',
  // Communities & civic life
  'fan': '#EC4899',
  'donor': '#DC2626',
  'community-organizer': '#7C3AED',
  'civic-participant': '#6B21A8',
  // People under pressure
  'journalist': '#F43F5E',
  // Businesses
  'merchant': '#CA8A04',
  'founder': '#0891B2',
  'manufacturer': '#475569',
  // Personal records / life
  'patient': '#DC2626',
  'homeowner': '#CA8A04',
};

export function personaColor(id: string): string {
  return PERSONA_COLOR[id] || '#6B7280';
}

// Portrait icons. Keys are the kebab-case names used in persona .md frontmatter.
// Statically mapped (rather than lucide-react/dynamic) so the build does not
// code-split the entire icon library into per-icon chunks.
const PORTRAIT_ICONS: Record<string, LucideIcon> = {
  armchair: Armchair, bike: Bike, 'book-open': BookOpen, briefcase: Briefcase,
  'building-2': Building2, car: Car, code: Code, coffee: Coffee, cpu: Cpu,
  factory: Factory, film: Film, 'flask-conical': FlaskConical, 'gamepad-2': Gamepad2,
  'graduation-cap': GraduationCap, 'hand-heart': HandHeart, 'hard-hat': HardHat,
  'heart-pulse': HeartPulse, house: House, key: Key, landmark: Landmark,
  laptop: Laptop, mic: Mic, microscope: Microscope, music: Music,
  newspaper: Newspaper, package: Package, 'pen-line': PenLine, 'pen-tool': PenTool,
  pill: Pill, scale: Scale, school: School, 'shopping-bag': ShoppingBag,
  smartphone: Smartphone, sprout: Sprout, store: Store, terminal: Terminal,
  'trending-up': TrendingUp, truck: Truck, users: Users, utensils: Utensils,
  video: Video, wheat: Wheat, wrench: Wrench,
};

// Resolve a portrait's icon by the kebab-case name in persona .md frontmatter.
export function portraitIcon(name: string): LucideIcon {
  return PORTRAIT_ICONS[name] || User;
}

// One representative icon per persona. Single source of truth for both the
// landing-page card emblems and the graph-view nodes — change an entry here
// and both surfaces update together. Hand-picked per persona rather than
// reusing a portrait icon so the persona reads clearly at a glance.
const PERSONA_ICON: Record<string, LucideIcon> = {
  // Earners / makers
  'creator': Palette,
  'freelance-professional': Laptop,
  'gig-worker': Bike,
  'oss-maintainer': GitBranch,
  'researcher': Microscope,
  'farmer': Tractor,
  // Money users
  'investor': TrendingUp,
  'shopper': ShoppingBag,
  // Communities & civic life
  'fan': Star,
  'donor': HandHeart,
  'community-organizer': Users,
  'civic-participant': Vote,
  // People under pressure
  'journalist': Newspaper,
  // Businesses
  'merchant': Store,
  'founder': Rocket,
  'manufacturer': Factory,
  // Personal records / life
  'patient': HeartPulse,
  'homeowner': House,
};

// Resolve a persona's representative icon by persona id.
export function personaIcon(id: string): LucideIcon {
  return PERSONA_ICON[id] || User;
}
