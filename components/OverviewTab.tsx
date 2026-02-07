import React from 'react';
import { DomainData } from '../types';
import { renderMarkdownLinks } from '../utils';
import { ExternalLink, AlertCircle, Lightbulb, BookOpen, FolderGit2 } from 'lucide-react';

interface OverviewTabProps {
  data: DomainData;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ data }) => {
  const getStatusInfo = (status: string) => {
    const isActive = status === 'active' || status === 'beta';
    return {
        isActive,
        // Active = Green Circle, Inactive = Red Square (rounded-none for sharp square)
        indicatorClass: isActive ? 'bg-green-500 rounded-full' : 'bg-red-500 rounded-none',
        label: isActive ? 'Active' : 'Inactive'
    };
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* Opportunity Section (Previously The Problem) */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-alertRed fill-current" />
          <h3 className="text-2xl font-bold font-heading">The Opportunity</h3>
        </div>
        <div className="bg-white border-2 border-black p-6 rounded-2xl shadow-sketch relative">
          {/* Decorative 'tape' */}
          <div className="absolute -top-3 left-6 w-20 h-4 bg-alertRed/30 -rotate-1 border border-transparent"></div>
          
          <p className="text-lg font-medium text-gray-800 leading-relaxed">
            {renderMarkdownLinks(data.problemStatement)}
          </p>
        </div>
      </section>

      {/* Ideas Section - List View */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Lightbulb className="w-6 h-6" />
          <h3 className="text-2xl font-bold font-heading">Ideas</h3>
          <span className="text-sm text-gray-500 ml-2 font-sans">Where to start building</span>
        </div>
        
        {data.ideas.length > 0 ? (
          <div className="flex flex-col gap-4">
            {data.ideas.map((idea, idx) => (
              <div key={idx} className="bg-white border-2 border-black rounded-xl p-5 shadow-sketch-sm hover:shadow-sketch hover:-translate-y-0.5 transition-all group">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 md:gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-xl font-heading group-hover:text-blue-600 transition-colors">{renderMarkdownLinks(idea.title)}</h4>
                        </div>
                        <p className="text-gray-600 font-medium leading-snug">{renderMarkdownLinks(idea.description)}</p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
            <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-2xl text-gray-400">
                No ideas listed yet.
            </div>
        )}
      </section>

      {/* Examples Section - Card/Grid View */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <FolderGit2 className="w-6 h-6" />
          <h3 className="text-2xl font-bold font-heading">Examples</h3>
          <span className="text-sm text-gray-500 ml-2 font-sans">Who has worked on this</span>
        </div>

        {data.projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {data.projects.map((project, idx) => {
                    const statusInfo = getStatusInfo(project.status);
                    return (
                        <a 
                            key={idx} 
                            href={project.url || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`bg-white border-2 border-black rounded-xl p-5 shadow-sketch hover:-translate-y-1 hover:shadow-sketch-hover transition-all group flex flex-col gap-3 h-full ${!project.url ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-xl font-heading leading-tight group-hover:text-blue-600 transition-colors">{project.name}</h4>
                                {/* Visual Status Indicator Only */}
                                <div 
                                    className={`w-3 h-3 ${statusInfo.indicatorClass} flex-shrink-0 mt-1.5`} 
                                    title={statusInfo.label}
                                />
                            </div>
                            <p className="text-gray-600 font-medium leading-snug flex-1">{renderMarkdownLinks(project.description)}</p>
                            {project.url && (
                                <div className="flex justify-end mt-2">
                                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-ethBlue transition-colors" />
                                </div>
                            )}
                        </a>
                    );
                })}
            </div>
        ) : (
             <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-2xl text-gray-400">
                No projects listed yet.
            </div>
        )}
      </section>

      {/* Resources Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6" />
          <h3 className="text-2xl font-bold font-heading">Resources</h3>
        </div>
        <ul className="space-y-4 pl-2">
          {data.resources.map((res, idx) => (
            <li key={idx} className="group">
              <a href={res.link} className="flex flex-col gap-1 hover:translate-x-2 transition-transform">
                <div className="font-bold text-blue-600 text-lg flex items-center gap-2 underline decoration-2 underline-offset-2 decoration-blue-200 group-hover:decoration-blue-600">
                  {res.title} {res.year && <span className="text-gray-500 no-underline text-base">({res.year})</span>}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-gray-700 font-medium max-w-2xl border-l-4 border-blue-200 pl-3">
                  {renderMarkdownLinks(res.description)}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default OverviewTab;