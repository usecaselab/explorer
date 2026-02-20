import React from 'react';
import {
  Heart, Landmark, Banknote, Truck, Film, Wheat, Scale,
  Microscope, Building2, ShoppingBag, Zap, Leaf, Cpu,
  Briefcase, Fingerprint, Shield,
} from 'lucide-react';

export interface RoleDef {
  label: string;
  slug: string;
  domain: string;
  icon: React.FC<{ className?: string }>;
}

export const ROLES: RoleDef[] = [
  { label: 'AI & Data', slug: 'ai-data', domain: 'ai', icon: Cpu },
  { label: 'Business Operations', slug: 'business-operations', domain: 'business-operations', icon: Briefcase },
  { label: 'Civil Society', slug: 'civil-society', domain: 'civil-society', icon: Scale },
  { label: 'Commerce', slug: 'commerce', domain: 'commerce', icon: ShoppingBag },
  { label: 'Energy & Utilities', slug: 'energy', domain: 'utilities', icon: Zap },
  { label: 'Environment', slug: 'environment', domain: 'environment', icon: Leaf },
  { label: 'Finance', slug: 'finance', domain: 'finance', icon: Banknote },
  { label: 'Food & Agriculture', slug: 'food-agriculture', domain: 'food-and-agriculture', icon: Wheat },
  { label: 'Government', slug: 'government', domain: 'government', icon: Landmark },
  { label: 'Health', slug: 'health', domain: 'health', icon: Heart },
  { label: 'Identity & Credentials', slug: 'identity', domain: 'identity', icon: Fingerprint },
  { label: 'Insurance', slug: 'insurance', domain: 'insurance', icon: Shield },
  { label: 'Media', slug: 'media', domain: 'media', icon: Film },
  { label: 'Real Estate', slug: 'real-estate', domain: 'real-estate-and-housing', icon: Building2 },
  { label: 'Science', slug: 'science', domain: 'science', icon: Microscope },
  { label: 'Supply Chain & Logistics', slug: 'supply-chain', domain: 'logistics-and-trade', icon: Truck },
];

const ROLE_BY_DOMAIN: Record<string, RoleDef> = {};
ROLES.forEach(r => { ROLE_BY_DOMAIN[r.domain] = r; });

export function domainLabel(domain: string): string {
  return ROLE_BY_DOMAIN[domain]?.label ?? domain;
}

interface RoleSelectorProps {
  activeDomainFilter: string | null;
  setActiveDomainFilter: (filter: string | null) => void;
  ideaCounts: Record<string, number>;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  activeDomainFilter,
  setActiveDomainFilter,
  ideaCounts,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto mt-8 px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
      <p className="text-sm font-medium text-gray-500 mb-3 text-center">I'm interested in...</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {ROLES.map(role => {
          const active = activeDomainFilter === role.domain;
          const count = ideaCounts[role.domain] || 0;
          const Icon = role.icon;
          return (
            <button
              key={role.domain}
              onClick={() => setActiveDomainFilter(active ? null : role.domain)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                active
                  ? 'bg-black text-white border-black shadow-sketch-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-black hover:text-black'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 leading-tight">{role.label}</span>
              <span className={`text-xs font-bold ${active ? 'text-gray-300' : 'text-gray-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelector;
