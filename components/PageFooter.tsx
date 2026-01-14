import React from 'react';
import { GitPullRequest } from 'lucide-react';

const PageFooter: React.FC = () => {
  return (
    <div className="mt-16 pt-8 border-t-2 border-black/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Edit Button */}
        <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-black font-bold border-2 border-gray-200 hover:border-black rounded-lg px-4 py-2 transition-all group bg-white">
            <GitPullRequest className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Edit this Page
        </a>

        {/* Page Metadata */}
        <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Page last update: October 18, 2025</span>
            <div className="flex items-center gap-3">
                 <div className="flex -space-x-2">
                    {[1,2,3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="contributor" />
                        </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-ethBlue text-white flex items-center justify-center text-xs font-bold z-10">
                        +7
                    </div>
                 </div>
                 <a href="#" className="text-sm font-bold text-ethBlue hover:underline decoration-2 underline-offset-2">See contributors</a>
            </div>
        </div>
    </div>
  );
};

export default PageFooter;