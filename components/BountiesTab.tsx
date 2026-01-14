import React from 'react';
import { Bounty } from '../types';
import { CircleDollarSign, ExternalLink, Briefcase } from 'lucide-react';

interface BountiesTabProps {
  bounties: Bounty[];
}

const BountyItem: React.FC<{ bounty: Bounty }> = ({ bounty }) => {
  const isClickable = !!bounty.url;
  const Wrapper = isClickable ? 'a' : 'div';
  const wrapperProps = isClickable ? {
    href: bounty.url,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "bg-white border-2 border-black rounded-xl p-5 shadow-sketch-sm hover:shadow-sketch hover:-translate-y-0.5 transition-all group block"
  } : {
    className: "bg-white border-2 border-black rounded-xl p-5 shadow-sketch-sm transition-all block"
  };

  const statusColors = {
    'Open': 'bg-green-100 text-green-800 border-green-200',
    'Closed': 'bg-gray-100 text-gray-800 border-gray-200',
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-200'
  };

  return (
    <Wrapper {...wrapperProps}>
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-xl font-bold font-heading group-hover:text-blue-600 transition-colors">
              {bounty.title}
            </h4>
            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${statusColors[bounty.status]}`}>
              {bounty.status}
            </span>
          </div>
          <p className="text-gray-600 font-medium mb-3">{bounty.description}</p>
        </div>
        
        <div className="flex items-start md:items-center gap-2 min-w-fit">
          <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-200">
            <CircleDollarSign className="w-5 h-5 text-yellow-600" />
            <span className="font-bold text-gray-900">{bounty.amount}</span>
          </div>
          {isClickable && <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />}
        </div>
      </div>
    </Wrapper>
  );
};

const BountiesTab: React.FC<BountiesTabProps> = ({ bounties }) => {
  if (bounties.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-2xl">
        <Briefcase className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium text-lg">No open bounties at the moment.</p>
        <p className="text-gray-400 text-sm">Check back later or propose a project in the Activity tab.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 flex flex-col gap-4">
      {bounties.map((bounty, idx) => (
        <BountyItem key={idx} bounty={bounty} />
      ))}
    </div>
  );
};

export default BountiesTab;