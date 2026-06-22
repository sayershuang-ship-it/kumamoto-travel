# Kumamoto Travel Guide

Interactive travel itinerary and planning website for Kumamoto, Japan built with Astro.

## 🗾 About

A comprehensive travel guide and itinerary planner for Kumamoto prefecture featuring:
- Daily itinerary planning
- Interactive maps and attractions
- Local recommendations
- Travel logistics and booking information

## 🛠️ Tech Stack

- **Framework**: Astro
- **Styling**: CSS/Tailwind
- **Content**: Markdown-based itineraries
- **Deployment**: Cloudflare Pages

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm/pnpm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📂 Project Structure

```
kumamoto-travel/
├── src/
│   ├── components/    # Astro components
│   ├── layouts/       # Page layouts
│   ├── pages/         # Route pages
│   └── styles/        # Global styles
├── public/            # Static assets
└── astro.config.mjs   # Astro configuration
```

## 🌐 Features

- Interactive daily itineraries
- Map integration with attractions
- Weather information
- Restaurant and hotel recommendations
- Transportation guides
- Mobile-responsive design

## 🚀 Deployment

### Cloudflare Pages

```bash
# Build the project
npm run build

# Deploy (configured in .github/workflows)
# or manually through Cloudflare dashboard
```

### Environment Variables

Create `.env` with:
```
VITE_API_ENDPOINT=your_api_endpoint
VITE_MAP_API_KEY=your_map_api_key
```

## 📝 Content

Travel information is stored in markdown files and can be edited directly.

## 🔐 Security

- Keep `.env` local, never commit
- API keys stored in environment variables
- Use `.gitignore` for sensitive files

## 📚 Documentation

- [Astro Docs](https://docs.astro.build)
- [Cloudflare Pages](https://pages.cloudflare.com)

## 🆘 Troubleshooting

- Clear `.astro` cache: `rm -rf .astro`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node version: `node --version`

## 📞 Support

For issues and feature requests, check the GitHub issues.

---

*Last Updated: 2026-06-22*
