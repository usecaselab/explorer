import React, { useEffect } from 'react';
import { DomainData } from '../types';
import OverviewTab from './OverviewTab';
import PageFooter from './PageFooter';
import { X } from 'lucide-react';

interface UseCaseModalProps {
  data: DomainData;
  lastUpdated?: string;
  onClose: () => void;
}

const UseCaseModal: React.FC<UseCaseModalProps> = ({ data, lastUpdated, onClose }) => {

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white border-2 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-start justify-between p-6 md:p-8 pb-4 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl md:text-4xl font-bold font-heading text-markerBlack leading-tight">
              {data.title}
            </h2>
            {data.problemStatement === "Loading..." && (
              <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 border border-yellow-300 rounded mt-2 animate-pulse">
                Fetching data...
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors border-2 border-transparent hover:border-black"
          >
            <X className="w-6 h-6 text-markerBlack" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <OverviewTab data={data} />
          <PageFooter lastUpdated={lastUpdated} />
        </div>
      </div>
    </div>
  );
};

export default UseCaseModal;
