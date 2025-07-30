// GitHub Repository types - simplified to only what we need
export interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  repo_config?: TomlConfig;
}

// TOML Configuration structure
export interface TomlConfig {
  meta?: {
    title?: string;
    description?: string;
    author?: string;
    useCase?: string;
    language?: string;
    framework?: string;
  };
  build?: {
    command?: string;
  };
  config?: {
    sample?: string;
    output?: string;
  };
  "post-build"?: {
    message?: string;
  };
  // Legacy fields for backward compatibility
  title?: string;
  description?: string;
  category?: string;
  language?: string;
  framework?: string;
  use_case?: string;
  vertical?: string;
  tags?: string[];
  deployment?: {
    platforms?: string[];
    requirements?: string[];
  };
  links?: {
    docs?: string;
    demo?: string;
    video?: string;
  };
  author?: {
    name?: string;
    email?: string;
    github?: string;
  };
  requirements?: {
    node?: string;
    python?: string;
    dependencies?: string[];
  };
}

// GitHub API response for file content
export interface GitHubFileContent {
  name: string;
  path: string;
  content: string;
  encoding: string;
}

// Filter options for the UI
export interface FilterOptions {
  language?: string;
  category?: string;
  framework?: string;
  vertical?: string;
  tags?: string[];
}

// Search and filter state
export interface StarterFilters {
  search: string;
  language: string[];
  category: string[];
  framework: string[];
  vertical: string[];
  tags: string[];
}

// Processed starter data for the UI
export interface ProcessedStarter {
  id: number;
  name: string;
  title: string;
  description: string;
  language: string;
  framework?: string;
  category?: string;
  vertical?: string;
  tags?: string[];
  links: {
    github: string;
    docs?: string;
    demo?: string;
    video?: string;
  };
  stats: {
    stars: number;
    forks: number;
    lastUpdated: string;
  };
  deployment?: {
    platforms?: string[];
    requirements?: string[];
  };
  config?: TomlConfig; // Include full TOML config for detailed views
}