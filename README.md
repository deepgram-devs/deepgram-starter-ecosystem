# Deepgram Quickstarts Hub 🚀

A modern, dynamic showcase for Deepgram's starter applications ecosystem. This Next.js application automatically discovers and displays starter projects from the `deepgram-starters` GitHub organization, providing developers with an intuitive way to find and deploy quickstart applications.

## 🎯 Overview

The Deepgram Quickstarts Hub serves as the central discovery platform for our starter applications. It dynamically fetches repository data, README content, and configuration metadata to present a comprehensive, searchable catalog of quickstart projects.

### Key Features

- **🔄 Dynamic Content**: Automatically syncs with GitHub repositories
- **📋 Rich Metadata**: Displays project details from `deepgram.toml` configuration files
- **🔍 Advanced Filtering**: Search by language, framework, use case, and more
- **📖 Integrated Documentation**: Renders README files with proper markdown support
- **⚡ Quick Deploy**: Direct links to GitHub, live demos, and documentation
- **🎨 Modern UI**: Built with NextUI components and Tailwind CSS
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile

## 🛠 Tech Stack

| Category        | Technology                  |
|-----------------|-----------------------------|
| **Framework**   | Next.js 15.4.4 (App Router) |
| **Language**    | TypeScript                  |
| **UI Library**  | NextUI                      |
| **Styling**     | Tailwind CSS                |
| **Icons**       | Heroicons                   |
| **Animations**  | Framer Motion               |
| **Markdown**    | react-markdown + plugins    |
| **HTTP Client** | Fetch API                   |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- GitHub Personal Access Token (recommended)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd deepgram-quickstarts
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment setup**:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your GitHub token:
   ```bash
   # Optional but recommended for higher rate limits
   GH_PAT=your_github_personal_access_token_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**: [http://localhost:3000](http://localhost:3000)

## 📁 Project Architecture

```
src/
├── app/                          # Next.js App Router
│   ├── api/
│   │   └── starters/
│   │       ├── route.ts          # Main starters API endpoint
│   │       └── [slug]/
│   │           └── readme/
│   │               └── route.ts  # Individual README API
│   ├── starters/
│   │   └── [slug]/
│   │       └── page.tsx          # Starter detail pages
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── not-found.tsx             # 404 page
│   ├── page.tsx                  # Home page
│   └── providers.tsx             # React providers
├── components/                   # Reusable UI components
│   ├── FilterSidebar.tsx         # Filtering interface
│   ├── HeroSection.tsx           # Landing hero
│   ├── Loading.tsx               # Loading states
│   ├── SearchFilters.tsx         # Search functionality
│   └── StarterGrid.tsx           # Main grid display
├── lib/
│   └── github.ts                 # GitHub API integration
├── types/
│   └── index.ts                  # TypeScript definitions
├── public/                       # Static assets
└── config files...               # Next.js, Tailwind, etc.
```

## 🔌 API Reference

### Endpoints

#### `GET /api/starters`
Fetches all starter repositories with processed metadata.

**Response**:
```typescript
ProcessedStarter[] = {
  id: number;
  name: string;
  title: string;
  description: string;
  language: string;
  framework?: string;
  category?: string;
  links: {
    github: string;
    docs?: string;
    demo?: string;
  };
  stats: {
    stars: number;
    forks: number;
    lastUpdated: string;
  };
  config?: TomlConfig;
}
```

**Caching**: 5 minutes (300s) with 10-minute stale-while-revalidate

#### `GET /api/starters/[slug]/readme`
Fetches README content for a specific starter.

**Response**:
```typescript
{
  content: string;    // Base64 encoded content
  encoding: string;   // Usually "base64"
}
```

**Caching**: 10 minutes (600s) with 20-minute stale-while-revalidate

## 🔧 Configuration System

### TOML Configuration

Each starter repository can include a `deepgram.toml` file for metadata:

```toml
[meta]
title = "Voice Agent TypeScript"
description = "Real-time voice agent with WebSocket support"
author = "Deepgram"
language = "TypeScript"
framework = "Next.js"
useCase = "Voice Agent"

[build]
command = "npm install && npm run build"

[requirements]
node = "18+"
dependencies = ["@deepgram/sdk"]

[config]
sample = ".env.example"
output = ".env.local"

[post-build]
message = "Remember to add your Deepgram API key to .env.local"

[links]
docs = "https://docs.deepgram.com"
demo = "https://demo.example.com"

[deployment]
platforms = ["Vercel", "Netlify"]
requirements = ["Node.js 18+", "Deepgram API Key"]
```

### Data Flow

1. **Repository Discovery**: Fetches repos from `deepgram-starters` org
2. **Configuration Loading**: Reads `deepgram.toml` from each repo
3. **Data Processing**: Transforms raw data into UI-friendly format
4. **Caching**: Stores processed data with appropriate cache headers
5. **UI Rendering**: Displays data with filtering and search

## 🎨 UI Components

### Component Hierarchy

```
App
├── HeroSection
├── SearchFilters
├── FilterSidebar
└── StarterGrid
    └── StarterCard[]

StarterDetailPage
├── Sidebar
│   ├── BackButton
│   ├── StarterInfo
│   ├── ActionButtons
│   └── ConfigurationDisplay
└── MainContent
    └── MarkdownRenderer
```

### Styling Guidelines

- **Dark Theme**: Black backgrounds with gradient accents
- **Gradient Borders**: `from-indigo-400 via-purple-500 to-pink-500`
- **Typography**: Clean, readable hierarchy
- **Interactive Elements**: Hover states and smooth transitions
- **Responsive**: Mobile-first approach

## 🔍 GitHub Integration

### Authentication

The app uses GitHub's REST API v3. Authentication is optional but recommended:

- **Without token**: 60 requests/hour
- **With token**: 5,000 requests/hour

### Rate Limiting

- **Caching Strategy**: Reduces API calls through intelligent caching
- **Error Handling**: Graceful fallbacks to mock data
- **Retry Logic**: Built-in error recovery

### Content Updates

- **Repository changes**: Reflected within 5 minutes
- **README updates**: Reflected within 10 minutes
- **Manual refresh**: Users can force refresh anytime

## 🧪 Development Guidelines

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for Next.js and React
- **Prettier**: Consistent code formatting
- **Components**: Functional components with hooks
- **Error Handling**: Comprehensive try/catch blocks

### Testing Strategy

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run build verification
npm run build
```

### Adding New Features

1. **Create feature branch**: `git checkout -b feature/your-feature-name`
2. **Follow TypeScript patterns**: Use existing types and interfaces
3. **Update components**: Keep UI components reusable
4. **Test locally**: Verify functionality and responsive design
5. **Update documentation**: Add to README if needed

## 🐛 Troubleshooting

### Common Issues

**API 404 Errors**:
```bash
# Check if GitHub API is accessible
curl -I https://api.github.com/orgs/deepgram-starters/repos

# Verify environment variables
echo $GH_PAT
```

**Build Failures**:
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Styling Issues**:
```bash
# Regenerate Tailwind classes
npm run build:css
```

### Debug Mode

Enable verbose logging by setting:
```bash
NODE_ENV=development
```

## 🚀 Deployment

### Environment Variables (Production)

```bash
GH_PAT=github_pat_xxxxx                    # GitHub token
NEXT_PUBLIC_APP_URL=https://yourapp.com    # Production URL
```

### Vercel Deployment

1. **Connect GitHub**: Link your repository
2. **Set environment variables**: Add `GH_PAT` in Vercel dashboard
3. **Deploy**: Automatic deployments on push to main

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start

# Or export static files
npm run export
```

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create branch**: `git checkout -b feature/amazing-feature`
3. **Make changes**: Follow code standards
4. **Test thoroughly**: Verify functionality
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push branch**: `git push origin feature/amazing-feature`
7. **Open Pull Request**: Describe your changes

### Code Review Process

1. **Automated checks**: Linting, type checking, builds
2. **Manual review**: Code quality, functionality, design
3. **Testing**: Verify changes work as expected
4. **Approval**: At least one maintainer approval required

### Optimization Strategies

- **Image optimization**: Next.js automatic optimization
- **Code splitting**: Automatic route-based splitting
- **Caching**: Aggressive caching of GitHub API responses
- **Error boundaries**: Graceful error handling

## 🔒 Security

### Best Practices

- **Environment variables**: Never commit secrets
- **API tokens**: Use minimal required scopes
- **Dependencies**: Keep packages updated
- **CSP**: Content Security Policy headers

### GitHub Token Scopes

Required scopes for `GH_PAT`:
- `public_repo`: Read public repository data
- No additional scopes needed

---

## 👥 Team

**Maintainers**: Deepgram Developer Experience Team


