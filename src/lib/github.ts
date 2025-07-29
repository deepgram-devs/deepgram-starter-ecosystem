import { parse } from '@iarna/toml';
import type { Repo, TomlConfig, GitHubFileContent, ProcessedStarter } from '@/types';

// GitHub API base configuration
const GITHUB_API_BASE = 'https://api.github.com';
const ORG_NAME = 'deepgram-starters';

// Helper function to get GitHub API headers
function getApiHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Deepgram-Quickstarts-Hub/1.0',
  };

  if (process.env.GH_PAT) {
    headers['Authorization'] = `Bearer ${process.env.GH_PAT}`;
  }

  return headers;
}

// Fetch repository configuration from deepgram.toml file
export async function getRepoConfig(repoName: string): Promise<GitHubFileContent | null> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${ORG_NAME}/${repoName}/contents/deepgram.toml`,
      {
        cache: 'no-store',
        headers: getApiHeaders(),
      }
    );

    if (!response.ok) {
      console.log(`No deepgram.toml found for ${repoName}: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching config for ${repoName}:`, error);
    return null;
  }
}

// Main function to get all repository data
export async function getRepoData(): Promise<Repo[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/orgs/${ORG_NAME}/repos`,
      {
        cache: 'no-store',
        headers: getApiHeaders(),
      }
    );

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      console.error(`Failed to fetch repositories: ${response.status} - ${response.statusText}`);
      console.error(`Response: ${text}`);
      return [];
    }

    const repositories: Repo[] = await response.json();
    console.log(`Found ${repositories.length} repositories from ${ORG_NAME}`);

    // Process repositories in parallel
    const results = await Promise.all(
      repositories
        .filter((repo: Repo) => repo.name !== 'project-template')
        .map(async (repo: Repo) => {
          try {
            const config = await getRepoConfig(repo.name);
            if (!config) {
              console.log(`No config found for ${repo.name}, using defaults`);
              return repo;
            }

            const content = config?.content ? atob(config?.content) : '';
            const parsed: TomlConfig = parse(content) as TomlConfig;
            console.log(`✓ Loaded config for ${repo.name}`);
            return { ...repo, repo_config: parsed };
          } catch (error) {
            console.error(`Error processing ${repo.name}:`, error);
            return repo; // Return repo without config on error
          }
        })
    );

    const validResults = results.filter((result): result is Repo => result !== null);
    const configCount = validResults.filter(r => r.repo_config).length;
    console.log(`✓ Processed ${validResults.length} repositories (${configCount} with configs)`);
    return validResults;
  } catch (error) {
    console.error('Error in getRepoData:', error);
    return [];
  }
}

// Transform repository data into processed starters for the UI
export function transformToProcessedStarters(repos: Repo[]): ProcessedStarter[] {
  return repos.map((repo) => {
    const config = repo.repo_config;

    return {
      id: repo.id,
      name: repo.name,
      title: config?.meta?.title || formatRepoName(repo.name),
      description: config?.meta?.description || repo.description || 'No description available',
      language: config?.meta?.language || repo.language || 'Unknown',
      framework: config?.meta?.framework,
      category: config?.meta?.useCase,  // Map useCase to category
      vertical: undefined,  // Not in TOML structure yet - future feature
      tags: config?.tags || repo.topics || [],
      links: {
        github: repo.html_url,
        docs: config?.links?.docs,
        demo: config?.links?.demo,
        video: config?.links?.video,
      },
      stats: {
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        lastUpdated: repo.updated_at,
      },
      deployment: config?.deployment,
    };
  });
}

// Helper function to format repository names for display
function formatRepoName(name: string): string {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Get unique filter options from starters
export function getFilterOptions(starters: ProcessedStarter[]) {
  const languages = new Set<string>();
  const categories = new Set<string>();
  const frameworks = new Set<string>();
  const verticals = new Set<string>();
  const tags = new Set<string>();

  starters.forEach((starter) => {
    if (starter.language) languages.add(starter.language);
    if (starter.category) categories.add(starter.category);
    if (starter.framework) frameworks.add(starter.framework);
    if (starter.vertical) verticals.add(starter.vertical);
    starter.tags.forEach((tag) => tags.add(tag));
  });

  return {
    languages: Array.from(languages).sort(),
    categories: Array.from(categories).sort(),
    frameworks: Array.from(frameworks).sort(),
    verticals: Array.from(verticals).sort(),
    tags: Array.from(tags).sort(),
  };
}

// Filter starters based on search criteria
export function filterStarters(
  starters: ProcessedStarter[],
  filters: {
    search?: string;
    language?: string[];
    category?: string[];
    framework?: string[];
    vertical?: string[];
    tags?: string[];
  }
): ProcessedStarter[] {
  return starters.filter((starter) => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch =
        starter.title.toLowerCase().includes(searchTerm) ||
        starter.description.toLowerCase().includes(searchTerm) ||
        starter.name.toLowerCase().includes(searchTerm) ||
        starter.tags.some(tag => tag.toLowerCase().includes(searchTerm));

      if (!matchesSearch) return false;
    }

    // Language filter
    if (filters.language?.length && !filters.language.includes(starter.language)) {
      return false;
    }

    // Category filter
    if (filters.category?.length && starter.category && !filters.category.includes(starter.category)) {
      return false;
    }

    // Framework filter
    if (filters.framework?.length && starter.framework && !filters.framework.includes(starter.framework)) {
      return false;
    }

    // Vertical filter
    if (filters.vertical?.length && starter.vertical && !filters.vertical.includes(starter.vertical)) {
      return false;
    }

    // Tags filter
    if (filters.tags?.length) {
      const hasMatchingTag = filters.tags.some(filterTag =>
        starter.tags.some(starterTag => starterTag.toLowerCase() === filterTag.toLowerCase())
      );
      if (!hasMatchingTag) return false;
    }

    return true;
  });
}