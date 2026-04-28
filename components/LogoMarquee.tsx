import React from 'react';

interface LogoItem {
  name: string;
  href?: string;
  // If provided, renders an <img>; otherwise renders the name as a wordmark
  src?: string;
}

const logos: LogoItem[] = [
  { name: 'Ethereum Foundation', href: 'https://ethereum.foundation' },
  { name: 'Devconnect', href: 'https://devconnect.org' },
  { name: 'ETHGlobal', href: 'https://ethglobal.com' },
  { name: 'Edge Patagonia', href: 'https://luma.com/g6uy4h2y' },
  { name: 'ETHSF', href: 'https://luma.com/05xzqzun' },
  { name: 'Astral Protocol', href: 'https://astral.global' },
  { name: 'Optimism', href: 'https://optimism.io' },
  { name: 'Base', href: 'https://base.org' },
];

const LogoCell: React.FC<{ item: LogoItem }> = ({ item }) => {
  const inner = item.src ? (
    <img
      src={item.src}
      alt={item.name}
      className="h-6 sm:h-7 w-auto opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
      draggable={false}
    />
  ) : (
    <span className="font-heading text-sm sm:text-base text-gray-400 hover:text-gray-700 transition-colors whitespace-nowrap tracking-tight">
      {item.name}
    </span>
  );
  return item.href ? (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center px-6 sm:px-10"
    >
      {inner}
    </a>
  ) : (
    <span className="flex items-center justify-center px-6 sm:px-10">{inner}</span>
  );
};

const LogoMarquee: React.FC = () => {
  return (
    <section
      aria-label="Partners and collaborators"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-2 sm:pt-4 pb-2 sm:pb-4"
    >
      <p className="text-center text-[11px] uppercase tracking-[0.18em] text-gray-400 mb-4">
        Working alongside
      </p>
      <div className="logo-marquee group">
        <div className="logo-marquee-track">
          {logos.map((item) => (
            <LogoCell key={`a-${item.name}`} item={item} />
          ))}
          {/* duplicate for seamless loop */}
          {logos.map((item) => (
            <LogoCell key={`b-${item.name}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoMarquee;
