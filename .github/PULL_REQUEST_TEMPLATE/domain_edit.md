## Domain Edit

**Domain being edited:** <!-- e.g., Travel, AI, Supply Chain -->

### Changes Made
<!-- Describe what you changed -->

- [ ] Updated The Opportunity section
- [ ] Added/updated Ideas
- [ ] Added/updated Projects
- [ ] Added/updated Resources
- [ ] Other:

---

## Domain File Format Guide

All domain files are located in `public/data/` and follow this format:

```markdown
---
title: Domain Name
sector: Sector Name
---

## The Opportunity

A 3-4 sentence description of the use case opportunity and problems being solved.

## Ideas

- Idea name - Description of the idea and what it enables.
- Another idea - Its description goes here.

## Projects

- [Project Name](https://url.com) - Brief description of the project.
- [Another Project](https://url.com) - What this project does.

## Resources

- [Resource Title](https://url.com) (2024) - Description of the resource.
- [Research Paper](https://url.com) (2023) - What this paper covers.
```

### Sectors

Use one of these sectors in the frontmatter:
- `Society` - Advocacy, Governance, Education, Law, Public Admin, Philanthropy, Security, Science
- `Finance` - Alternative Money, Credit, Insurance, Public Finance
- `Consumer` - Retail, Services, Travel, Social, Media, Gaming
- `Enterprise` - Business Ops, Supply Chain, Transport, Productivity, IP, Marketing
- `Digital` - AI, Data, IT Infrastructure, Hardware & IoT
- `Physical` - Energy, Food & Agriculture, Real Estate, Sustainability, Health

### Ideas Format

Each idea should be a single line:
```
- Idea name - Description explaining what it enables or solves.
```

### Projects Format

Each project should link to the project and include a brief description:
```
- [Project Name](https://project-url.com) - What this project does.
```

### Resources Format

Resources should include a year when available:
```
- [Title](https://url.com) (2024) - Description of the resource.
```

### Guidelines

1. **No status markers** - Don't add (dead), [defunct], or similar markers. Remove projects that are no longer active.
2. **Keep descriptions concise** - One sentence per item.
3. **Use proper markdown links** - `[Text](URL)` format.
4. **Alphabetize when possible** - Keep lists organized.
