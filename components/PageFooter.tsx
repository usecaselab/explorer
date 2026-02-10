import React from 'react';

interface PageFooterProps {
  lastUpdated?: string;
}

const PageFooter: React.FC<PageFooterProps> = ({ lastUpdated }) => {
  return (
    <div className="mt-16 pt-8 border-t-2 border-black/10 flex items-center justify-end">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Page last update: {lastUpdated || 'Unknown'}
        </span>
    </div>
  );
};

export default PageFooter;
