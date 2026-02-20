import React from 'react';
import {
  Heart, Landmark, Banknote, Truck, Film, Wheat, Scale,
  Microscope, Building2, ShoppingBag, Zap, Leaf, Cpu,
  Briefcase, Fingerprint,
} from 'lucide-react';

export interface RoleDef {
  label: string;
  slug: string;
  domains: string[];
  icon: React.FC<{ className?: string }>;
}

export const ROLES: RoleDef[] = [
  { label: 'Healthcare', slug: 'healthcare', domains: ['health'], icon: Heart },
  { label: 'Government & Public Sector', slug: 'government', domains: ['government'], icon: Landmark },
  { label: 'Financial Services', slug: 'financial-services', domains: ['finance'], icon: Banknote },
  { label: 'Supply Chain & Logistics', slug: 'supply-chain', domains: ['logistics-and-trade'], icon: Truck },
  { label: 'Media & Entertainment', slug: 'media', domains: ['media'], icon: Film },
  { label: 'Agriculture & Food', slug: 'agriculture', domains: ['food-and-agriculture'], icon: Wheat },
  { label: 'Legal & Civil Society', slug: 'legal', domains: ['civil-society'], icon: Scale },
  { label: 'Science & Research', slug: 'science', domains: ['science'], icon: Microscope },
  { label: 'Real Estate', slug: 'real-estate', domains: ['real-estate-and-housing'], icon: Building2 },
  { label: 'Retail & Commerce', slug: 'retail', domains: ['commerce'], icon: ShoppingBag },
  { label: 'Energy & Utilities', slug: 'energy', domains: ['utilities'], icon: Zap },
  { label: 'Environment', slug: 'environment', domains: ['environment'], icon: Leaf },
  { label: 'AI & Data', slug: 'ai-data', domains: ['ai', 'data'], icon: Cpu },
  { label: 'Business Operations', slug: 'business-operations', domains: ['business-operations'], icon: Briefcase },
  { label: 'Identity & Credentials', slug: 'identity', domains: ['identity'], icon: Fingerprint },
];

interface RoleSelectorProps {
  activeDomainFilter: string[] | null;
  setActiveDomainFilter: (filter: string[] | null) => void;
  ideaCounts: Record<string, number>;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  activeDomainFilter,
  setActiveDomainFilter,
  ideaCounts,
}) => {
  const isActive = (role: RoleDef) =>
    activeDomainFilter !== null &&
    role.domains.length === activeDomainFilter.length &&
    role.domains.every(d => activeDomainFilter.includes(d));

  const handleClick = (role: RoleDef) => {
    if (isActive(role)) {
      setActiveDomainFilter(null);
    } else {
      setActiveDomainFilter(role.domains);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
      <p className="text-sm font-medium text-gray-500 mb-3 text-center">I'm interested in...</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {ROLES.map(role => {
          const active = isActive(role);
          const count = role.domains.reduce((sum, d) => sum + (ideaCounts[d] || 0), 0);
          const Icon = role.icon;
          return (
            <button
              key={role.label}
              onClick={() => handleClick(role)}
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
