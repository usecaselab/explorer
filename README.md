<div align="center">

# Use Case Lab

**Discover real-world Ethereum use cases across 30+ domains**

[Live Demo](https://usecaselab.eth.limo) · [Submit a Use Case](https://github.com/usecaselab/explorer/issues/new?template=use-case-submission.md&title=%5BUse%20Case%5D%20) · [Report Bug](https://github.com/usecaselab/explorer/issues)

</div>

---

## About

Use Case Lab is an interactive compendium of real-world Ethereum use cases, organized across 30+ domains including Finance, Healthcare, Supply Chain, Gaming, and more. Built by the Ethereum Foundation to help developers, entrepreneurs, and researchers discover how blockchain technology is solving real problems across industries.

### Features

- **Search** - Find use cases, projects, and ideas across all domains
- **Explore by Category** - Browse 6 major categories: Society, Finance, Consumer, Enterprise, Digital, and Physical
- **Domain Deep-Dives** - Detailed overviews with problem statements, existing projects, and resources
- **Bounties** - Discover funding opportunities and open challenges
- **Community Submissions** - Submit your own use cases via GitHub

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/usecaselab/explorer.git
   cd explorer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
├── App.tsx                 # Main application component
├── index.html              # HTML entry point with SEO meta tags
├── index.tsx               # React entry point
├── constants.ts            # Domain categories and initial data
├── types.ts                # TypeScript type definitions
├── utils.ts                # Utility functions
├── components/
│   ├── DomainSidebar.tsx   # Category navigation sidebar
│   ├── OverviewTab.tsx     # Domain overview content
│   ├── BountiesTab.tsx     # Bounties and funding opportunities
│   ├── Logo.tsx            # Application logo
│   ├── PageFooter.tsx      # Page metadata footer
│   └── SiteFooter.tsx      # Site-wide footer
└── public/
    └── data/               # Domain markdown files
        ├── ai.md
        ├── education.md
        ├── energy.md
        └── ...
```

## Contributing

We welcome contributions! Here's how you can help:

### Submit a Use Case

1. Click the "Submit Use Case" button on the homepage, or
2. [Open a new issue](https://github.com/usecaselab/explorer/issues/new?template=use-case-submission.md&title=%5BUse%20Case%5D%20) with your use case details

### Contribute Code

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Add or Update Domain Content

Domain content is stored as Markdown files in `/public/data/`. Each file follows a structured format with sections for:
- Problem Statement
- Ideas
- Projects
- Resources
- Bounties

## Tech Stack

- **Framework**: [React](https://react.dev/) 19
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

## License

This project is open source and available under the [MIT License](LICENSE).

## Links

- **Website**: [usecaselab.eth.limo](https://usecaselab.eth.limo)
- **GitHub**: [github.com/usecaselab/explorer](https://github.com/usecaselab/explorer)
- **Ethereum Foundation**: [ethereum.org](https://ethereum.org)

---

<div align="center">

Built with ❤️ by the [Ethereum Foundation](https://ethereum.org)

</div>
