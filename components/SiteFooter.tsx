
import React from 'react';
import { Github } from 'lucide-react';
import Logo from './Logo';

const SiteFooter: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t-2 border-black py-12 relative z-20 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">

                {/* Brand */}
                <div className="flex items-center gap-3">
                    <Logo showText />
                </div>

                {/* Socials */}
                <div className="flex gap-3">
                    <a href="https://github.com/usecaselab/explorer" target="_blank" rel="noopener noreferrer" className="p-2 border-2 border-black rounded-lg hover:bg-gray-50 transition-all hover:-translate-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Github className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </div>
    </footer>
  );
};

export default SiteFooter;
