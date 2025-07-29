# Deepgram Quickstarts Ecosystem Hub 🚀

**Deepgram's Quickstart Ecosystem** - A unified starters ecosystem with modular, back-end-first starter apps and optional front-end components for rapidly building tailored demos.

## Overview

This is the centralized hub that showcases all available Deepgram starter applications. It provides a modern, searchable interface for discovering and deploying starter apps across different languages, frameworks, and use cases.

## Features

- 🎯 **Dynamic Discovery**: Automatically loads starters from GitHub API
- 🔍 **Smart Filtering**: Search by language, vertical, use case, or framework
- 📱 **Responsive Design**: Modern grid layout optimized for all devices
- ⚡ **Fast Deployment**: Direct links to code, deploy buttons, and documentation
- 🎨 **Modern UI**: Built with NextUI and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15.4.4 with App Router
- **UI Library**: NextUI (transitioning to HeroUI)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **Language**: TypeScript

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   # The .env.local file is already created for you
   # Edit it to add your GitHub Personal Access Token
   # Get your token at: https://github.com/settings/tokens
   # Required scope: public_repo
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**: Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/starters/      # GitHub API integration
│   ├── components/        # Reusable UI components
│   └── (hub)/            # Main ecosystem hub pages
├── lib/                   # Utilities and data fetching
├── types/                 # TypeScript definitions
└── config/               # Configuration files
```

## Environment Variables

- `GH_PAT`: GitHub Personal Access Token for API access
- `NEXT_PUBLIC_APP_URL`: Application URL for metadata

## Development Workflow

1. **Prototype First**: Focus on MVP functionality over polish
2. **Component-Based**: Build reusable UI components
3. **API-Driven**: Integrate with GitHub API for dynamic content
4. **Responsive**: Mobile-first design approach

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## Deployment

The app is designed to be deployed on Vercel, Netlify, or any platform supporting Next.js.

```bash
npm run build
npm run start
```

## Maintainer Notes

- **Security**: No hardcoded API keys - use environment variables
- **Performance**: Implement proper caching for GitHub API calls
- **Scalability**: Design for easy addition of new starter categories
- **Testing**: Include basic tests for critical functionality

---

Built with ❤️ by the Deepgram team
