import React from 'react';

interface AboutPageProps {
  onBack: () => void;
}

const designSprints = [
  {
    title: 'Ethereum Unblock SF',
    description: 'Mar 9-13, 2026 | ETHSF',
    links: [{ label: 'Luma', href: 'https://luma.com/05xzqzun' }],
  },
  {
    title: 'Argentina Onchain',
    description: 'Nov 1-14, 2025 | Edge Patagonia',
    links: [
      { label: 'Luma', href: 'https://luma.com/g6uy4h2y' },
      { label: 'Video', href: 'https://x.com/petheth/status/2000650998243532814' },
      {
        label: 'Recap',
        href: 'https://andrejberlin.substack.com/p/9e317163-2a97-4d90-8461-33847d6efa8a',
      },
      {
        label: 'Report',
        href: 'https://docs.google.com/document/d/1N87Ba94Jcvwt0Qidz6wawyUgRPZVK40XFBBwBUwQeD0/edit?tab=t.0#heading=h.47r4lpfbrogj',
      },
    ],
  },
];

type TrackIcon = 'city' | 'shield' | 'cog' | 'signal' | 'cart';

const implementationTracks: {
  title: string;
  description: string;
  href: string;
  icon: TrackIcon;
}[] = [
  {
    title: 'Verifiable Cities',
    description: 'Call for collaborations in municipal services and operations',
    href: 'https://usecaselab.org/thesis/verifiable-cities',
    icon: 'city',
  },
  {
    title: 'Global Insurance',
    description: 'Working with insurtech to create globally interoperable safety nets',
    href: '#',
    icon: 'shield',
  },
  {
    title: 'Automated SMEs',
    description:
      'Converting business processes and contractual agreements into self-executing workflows',
    href: '#',
    icon: 'cog',
  },
  {
    title: 'Open Telematics',
    description: 'Advancing standards for Ethereum-powered telecommunication & geospatial services',
    href: 'https://usecaselab.org/thesis/open-telematics',
    icon: 'signal',
  },
  {
    title: 'Composable Commerce',
    description: 'Facilitating the exchange of real-world goods & services on Ethereum.',
    href: 'https://usecaselab.org/thesis/composable-commerce',
    icon: 'cart',
  },
];

const team = [
  { name: 'Ori Shimony', role: 'Lead', link: 'https://x.com/orishim' },
  { name: 'Pablo', role: 'Research Engineer', link: 'https://x.com/pblvrt' },
  {
    name: 'Rithikha Rajamohan',
    role: 'Program Specialist (Cities)',
    link: 'https://x.com/rithikxa_',
  },
  { name: 'Ian Lee', role: 'Advisor', link: null },
];

const TrackIconSvg: React.FC<{ icon: TrackIcon }> = ({ icon }) => {
  const cls = 'w-full h-full';
  if (icon === 'city') {
    return (
      <svg viewBox="0 0 48 48" fill="none" className={cls}>
        <rect x="8" y="18" width="12" height="22" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="28" y="10" width="12" height="30" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
        </rect>
        <rect x="20" y="24" width="8" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <line x1="12" y1="24" x2="16" y2="24" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <line x1="12" y1="28" x2="16" y2="28" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <line x1="32" y1="16" x2="36" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
        </line>
        <line x1="32" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <line x1="4" y1="40" x2="44" y2="40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (icon === 'shield') {
    return (
      <svg viewBox="0 0 48 48" fill="none" className={cls}>
        <path
          d="M24 4L6 12v12c0 11.1 7.8 21.5 18 24 10.2-2.5 18-12.9 18-24V12L24 4z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          opacity="0.2"
        >
          <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M24 4L6 12v12c0 11.1 7.8 21.5 18 24 10.2-2.5 18-12.9 18-24V12L24 4z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M16 24l5 5 11-11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <animate attributeName="stroke-dasharray" values="0,30;30,0" dur="2s" repeatCount="indefinite" />
        </path>
      </svg>
    );
  }
  if (icon === 'cog') {
    return (
      <svg viewBox="0 0 48 48" fill="none" className={cls}>
        <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="24" cy="24" r="3" stroke="currentColor" strokeWidth="1.5" fill="none">
          <animate attributeName="r" values="2.5;3.5;2.5" dur="3s" repeatCount="indefinite" />
        </circle>
        <line x1="24" y1="6" x2="24" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="24" y1="36" x2="24" y2="42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="6" y1="24" x2="12" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="36" y1="24" x2="42" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="11.3" y1="11.3" x2="15.5" y2="15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="32.5" y1="32.5" x2="36.7" y2="36.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="11.3" y1="36.7" x2="15.5" y2="32.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="32.5" y1="15.5" x2="36.7" y2="11.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </svg>
    );
  }
  if (icon === 'signal') {
    return (
      <svg viewBox="0 0 48 48" fill="none" className={cls}>
        <circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6">
          <animate attributeName="r" values="9;11;9" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4">
          <animate attributeName="r" values="15;17;15" dur="3s" begin="0.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2">
          <animate attributeName="r" values="21;23;21" dur="3s" begin="1s" repeatCount="indefinite" />
        </circle>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cls}>
      <path
        d="M8 8h4l6 24h16l6-18H16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="20" cy="38" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="34" cy="38" r="3" stroke="currentColor" strokeWidth="1.5" fill="none">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <line x1="22" y1="18" x2="36" y2="18" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="20" y1="24" x2="34" y2="24" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </svg>
  );
};

const ArrowDown = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);

const ArrowRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const AboutPage: React.FC<AboutPageProps> = ({ onBack: _onBack }) => {
  return (
    <div className="about-root">
      <main>
        {/* Hero */}
        <section className="relative pt-16 pb-16 md:pt-32 md:pb-36 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg
              className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] opacity-[0.06]"
              viewBox="0 0 400 400"
              fill="none"
            >
              <circle cx="200" cy="200" r="180" stroke="hsl(221, 83%, 53%)" strokeWidth="0.5" />
              <circle cx="200" cy="200" r="140" stroke="hsl(221, 83%, 53%)" strokeWidth="0.5" />
              <circle cx="200" cy="200" r="100" stroke="hsl(221, 83%, 53%)" strokeWidth="0.5" />
              <circle cx="200" cy="200" r="60" stroke="hsl(221, 83%, 53%)" strokeWidth="0.5" />
              <line x1="20" y1="200" x2="380" y2="200" stroke="hsl(221, 83%, 53%)" strokeWidth="0.5" />
              <line x1="200" y1="20" x2="200" y2="380" stroke="hsl(221, 83%, 53%)" strokeWidth="0.5" />
              <polygon points="200,40 340,200 200,360 60,200" stroke="hsl(221, 83%, 53%)" strokeWidth="0.5" fill="none" />
            </svg>
          </div>

          <div className="about-container relative z-10">
            <div className="max-w-3xl">
              <h1 className="mb-6 animate-fade-in-up" style={{ color: '#111827' }}>
                Advancing Ethereum into new real-world domains
              </h1>

              <p className="lead mb-10 max-w-2xl animate-fade-in-up animate-stagger-1">
                Use Case Lab is an applied research initiative at the{' '}
                <a
                  href="https://ethereum.foundation/ethereum"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline decoration-blue-200 underline-offset-2 transition-colors duration-200"
                >
                  Ethereum Foundation
                </a>
                . We use collaborative prototyping, pilots, and standards to unblock frontier use cases.
              </p>

              <div className="flex flex-wrap gap-4 animate-fade-in-up animate-stagger-2">
                <a href="#work" className="btn-primary">
                  Our work
                  <ArrowDown />
                </a>
                <a href="#residency" className="btn-secondary">
                  Apply for residency
                  <ArrowRight />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Tracks */}
        <section id="work" className="about-section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #f3f4f6' }}>
          <div className="about-container">
            <div className="mb-10 md:mb-16">
              <p className="section-label">Implementation Tracks</p>
              <h2 className="mb-4">What we're working on</h2>
              <p className="max-w-2xl" style={{ color: '#6b7280' }}>
                Each track represents a frontier domain where Ethereum can have meaningful real-world impact. We're
                building frameworks, running pilots, and collaborating with industry partners.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-16">
              {implementationTracks.map((track, index) => {
                const isExternal = track.href !== '#';
                const stagger = `animate-stagger-${Math.min(index + 1, 4)}`;
                const className = `group bg-white border border-gray-200 rounded-xl p-5 md:p-8 transition-all duration-200 hover:border-blue-200 hover:shadow-lg animate-fade-in-up ${stagger}`;
                const inner = (
                  <>
                    <div className="w-10 h-10 md:w-12 md:h-12 mb-4 md:mb-6 text-blue-600">
                      <TrackIconSvg icon={track.icon} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-200" style={{ color: '#111827' }}>
                      {track.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: '#6b7280' }}>
                      {track.description}
                    </p>
                    {isExternal && (
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 group-hover:gap-3 transition-all duration-200">
                        Read more
                        <ArrowRight />
                      </span>
                    )}
                  </>
                );
                return isExternal ? (
                  <a key={track.title} href={track.href} target="_blank" rel="noopener noreferrer" className={className}>
                    {inner}
                  </a>
                ) : (
                  <div key={track.title} className={className}>
                    {inner}
                  </div>
                );
              })}
            </div>

            {/* Design Sprints */}
            <div className="mt-4">
              <p className="section-label">Design Sprints</p>
              <p className="mb-8 max-w-2xl" style={{ color: '#6b7280' }}>
                Intensive collaborative sessions where we bring together builders and domain experts to prototype
                Ethereum solutions.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {designSprints.map((sprint) => (
                  <div key={sprint.title} className="card-hover">
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#111827' }}>
                      {sprint.title}
                    </h3>
                    <p className="text-sm mb-4" style={{ color: '#6b7280' }}>
                      {sprint.description}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {sprint.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 underline decoration-blue-200 underline-offset-2 transition-colors duration-200"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="about-section" style={{ backgroundColor: '#ffffff' }}>
          <div className="about-container">
            <div className="mb-10 md:mb-16">
              <p className="section-label">Our People</p>
              <h2 className="mb-4">Team</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {team.map((member, index) => (
                <div
                  key={member.name}
                  className={`card-hover animate-fade-in-up animate-stagger-${Math.min(index + 1, 4)}`}
                  style={{ padding: '1.25rem' }}
                >
                  <div className="w-11 h-11 md:w-14 md:h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 md:mb-5">
                    <span className="text-blue-600 font-semibold text-sm md:text-lg">
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <p className="font-semibold mb-1 text-sm md:text-base" style={{ color: '#111827' }}>
                    {member.name}
                  </p>
                  <p className="text-xs md:text-sm text-blue-600 mb-2 md:mb-3">{member.role}</p>
                  {member.link && (
                    <a
                      href={member.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-600 transition-colors duration-200"
                      aria-label={`${member.name} on X`}
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Residency + Contact */}
        <section id="residency" className="about-section" style={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}>
          <div className="about-container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10 md:mb-16">
                <p className="section-label">Get Involved</p>
                <h2 className="mb-4">Work with us</h2>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-8 md:p-12 mb-8">
                <h3 className="text-xl font-semibold mb-4" style={{ color: '#111827' }}>
                  Use Case Residency: Call for Applications
                </h3>
                <p className="mb-4 leading-relaxed" style={{ color: '#6b7280' }}>
                  Do you have one foot in the Ethereum ecosystem and another in a specialized non-crypto domain?
                </p>
                <p className="mb-6 leading-relaxed" style={{ color: '#6b7280' }}>
                  We're seeking domain experts who understand their field's institutional dynamics, incentive
                  structures, and technical bottlenecks—and who see Ethereum as a missing piece of the puzzle. As a
                  resident, you'll work intensively with the Use Case Lab to build concrete products or primitives
                  that unlock a specific real-world use case.
                </p>
                <a href="mailto:usecaselab@ethereum.org" className="btn-primary">
                  Apply now
                  <ArrowRight />
                </a>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-8 md:p-12 text-center">
                <h3 className="text-xl font-semibold mb-3" style={{ color: '#111827' }}>
                  Contact
                </h3>
                <p className="mb-4" style={{ color: '#6b7280' }}>
                  For use case related inquiries, please contact us at:
                </p>
                <a
                  href="mailto:usecaselab@ethereum.org"
                  className="text-blue-600 hover:text-blue-700 font-medium underline decoration-blue-200 underline-offset-2 transition-colors duration-200"
                >
                  usecaselab@ethereum.org
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
