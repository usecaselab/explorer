
import React from 'react';
import { Triangle, Square } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = false }) => {
  const sizeClasses = {
    sm: { container: 'w-6 h-6', triangle: 'w-4 h-4', square: 'w-3 h-3' },
    md: { container: 'w-8 h-8', triangle: 'w-6 h-6', square: 'w-5 h-5' },
    lg: { container: 'w-12 h-12', triangle: 'w-9 h-9', square: 'w-7 h-7' }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${currentSize.container}`}>
        <Triangle className={`absolute top-0 left-0 ${currentSize.triangle} text-yellow-400 fill-yellow-100 rotate-12`} />
        <Square className={`absolute bottom-0 right-0 ${currentSize.square} text-blue-400 rotate-45 bg-white`} />
      </div>
      {showText && (
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold text-ethBlue tracking-tight font-heading leading-none">
            Use Case Lab
          </h1>
          <span className="hidden md:block text-[10px] font-bold text-gray-500 tracking-widest uppercase">Ethereum Foundation</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
