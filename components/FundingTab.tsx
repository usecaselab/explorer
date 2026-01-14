import React from 'react';
import { FundingOpportunity } from '../types';
import { HandCoins, CalendarClock, Building2 } from 'lucide-react';

interface FundingTabProps {
  funding: FundingOpportunity[];
}

const FundingListItem: React.FC<{ item: FundingOpportunity }> = ({ item }) => {
  return (
    <a href={item.link} className="block border-2 border-black rounded-xl p-4 bg-white shadow-sketch-sm hover:shadow-sketch hover:-translate-y-0.5 transition-all group">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex-1">
             <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> {item.organization}
                </span>
                <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {item.type}
                </span>
             </div>
             <h4 className="text-lg font-bold font-heading group-hover:text-blue-600 transition-colors mb-1">{item.title}</h4>
             <p className="text-sm text-gray-600 font-medium">
                {item.description}
             </p>
        </div>

        <div className="flex md:flex-col items-center md:items-end gap-3 md:gap-1 min-w-fit">
             <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-lg border border-green-100">
                <HandCoins className="w-4 h-4 text-green-600" />
                <span className="font-bold text-green-700 text-sm whitespace-nowrap">{item.amount}</span>
            </div>
            {item.deadline && (
                 <div className="flex items-center gap-1 text-xs font-bold text-orange-600">
                    <CalendarClock className="w-3 h-3" />
                    Due {item.deadline}
                 </div>
            )}
        </div>
        
      </div>
    </a>
  );
};

const FundingTab: React.FC<FundingTabProps> = ({ funding }) => {
  if (funding.length === 0) {
     return (
      <div className="text-center py-20">
        <HandCoins className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-2xl font-bold text-gray-400 font-heading">No active funding</h3>
        <p className="text-gray-500">Check back later for grants and bounties.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col gap-4">
        {funding.map((item) => (
          <FundingListItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default FundingTab;