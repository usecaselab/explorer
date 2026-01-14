import React from 'react';
import { Project } from '../types';
import { FolderGit2, ExternalLink } from 'lucide-react';

interface ProjectsTabProps {
  projects: Project[];
}

const ProjectListItem: React.FC<{ project: Project }> = ({ project }) => {
  const isActive = project.status === 'active' || project.status === 'beta';
  // Active: Green Circle, Inactive: Red Square (rounded-none for sharp square)
  const indicatorClass = isActive ? 'bg-green-500 rounded-full' : 'bg-red-500 rounded-none';
  const label = isActive ? 'Active' : 'Inactive';

  const Wrapper = project.url ? 'a' : 'div';
  const wrapperProps = project.url ? { 
      href: project.url, 
      target: "_blank", 
      rel: "noopener noreferrer",
      className: "bg-white border-2 border-black rounded-xl p-4 shadow-sketch-sm hover:shadow-sketch hover:-translate-y-0.5 transition-all flex items-center justify-between gap-4 group cursor-pointer block"
  } : {
      className: "bg-white border-2 border-black rounded-xl p-4 shadow-sketch-sm hover:shadow-sketch hover:-translate-y-0.5 transition-all flex items-center justify-between gap-4 group cursor-default"
  };

  return (
    <Wrapper {...wrapperProps}>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h4 className="text-lg font-bold font-heading group-hover:text-blue-600 transition-colors">{project.name}</h4>
          {/* Status Indicator */}
          <div 
            className={`w-3 h-3 ${indicatorClass} flex-shrink-0`} 
            title={label}
          />
        </div>
        <p className="text-sm text-gray-600 font-medium">{project.description}</p>
      </div>
      {project.url && (
        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors opacity-0 group-hover:opacity-100" />
      )}
    </Wrapper>
  );
};

const ProjectsTab: React.FC<ProjectsTabProps> = ({ projects }) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-2xl">
        <FolderGit2 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">No projects tracked yet.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col gap-3">
        {projects.map((project, idx) => (
          <ProjectListItem key={idx} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsTab;