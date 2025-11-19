import { parse } from '@iarna/toml';
import type { Repo, TomlConfig, GitHubFileContent, ProcessedStarter } from '@/types';

// GitHub API base configuration
const GITHUB_API_BASE = 'https://api.github.com';
const ORG_NAME = 'deepgram-starters';

// Helper function to get GitHub API headers
function getApiHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Deepgram-Starter-Ecosystem/1.0',
  };

  if (process.env.GH_PAT) {
    headers['Authorization'] = `Bearer ${process.env.GH_PAT}`;
    console.log('✓ Using authenticated GitHub API (GH_PAT found)');
  } else {
    console.warn('⚠️  No GH_PAT found - using unauthenticated API (60 req/hour limit)');
  }

  return headers;
}

// Fetch repository configuration from deepgram.toml file
export async function getRepoConfig(repoName: string): Promise<GitHubFileContent | null> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${ORG_NAME}/${repoName}/contents/deepgram.toml`,
      {
        next: { revalidate: 86400 }, // Cache for 24 hours
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
        next: { revalidate: 86400 }, // Cache for 24 hours
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
        .filter((repo: Repo) => !repo.private) // Defensive: ensure no private repos in public list
        .map(async (repo: Repo) => {
          try {
            const config = await getRepoConfig(repo.name);
            if (!config) {
              console.log(`No config found for ${repo.name}, using defaults`);
              return repo;
            }

            const content = config?.content
              ? new TextDecoder('utf-8').decode(Uint8Array.from(atob(config?.content), c => c.charCodeAt(0)))
              : '';
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
      // TODO: Re-enable when vertical data is available in deepgram.toml
      // vertical: config?.meta?.vertical,
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
      config: config, // Include full config for detailed views
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
  // TODO: Re-enable when vertical data is available in deepgram.toml
  // const verticals = new Set<string>();
  const tags = new Set<string>();

  starters.forEach((starter) => {
    if (starter.language) languages.add(starter.language);
    if (starter.category) categories.add(starter.category);
    if (starter.framework) frameworks.add(starter.framework);
    // TODO: Re-enable when vertical data is available in deepgram.toml
    // if (starter.vertical) verticals.add(starter.vertical);
    if (starter.tags) {
      starter.tags.forEach((tag: string) => tags.add(tag));
    }
  });

  return {
    languages: Array.from(languages).sort(),
    categories: Array.from(categories).sort(),
    frameworks: Array.from(frameworks).sort(),
    // TODO: Re-enable when vertical data is available in deepgram.toml
    // verticals: Array.from(verticals).sort(),
    tags: Array.from(tags).sort(),
  };
}

// Fetch README content from a repository
export async function getRepoReadme(repoName: string): Promise<GitHubFileContent | null> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${ORG_NAME}/${repoName}/contents/README.md`,
      {
        next: { revalidate: 86400 }, // Cache for 24 hours
        headers: getApiHeaders(),
      }
    );

    if (!response.ok) {
      console.log(`No README.md found for ${repoName}: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching README for ${repoName}:`, error);
    return null;
  }
}

// Filter starters based on search criteria
export function filterStarters(
  starters: ProcessedStarter[],
  filters: {
    search?: string;
    language?: string[];
    category?: string[];
    framework?: string[];
    // TODO: Re-enable when vertical data is available in deepgram.toml
    // vertical?: string[];
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
        (starter.tags && starter.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm)));

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

    // TODO: Re-enable when vertical data is available in deepgram.toml
    // Vertical filter
    // if (filters.vertical?.length && starter.vertical && !filters.vertical.includes(starter.vertical)) {
    //   return false;
    // }

    // Tags filter
    if (filters.tags?.length && starter.tags?.length) {
      const hasMatchingTag = filters.tags.some(filterTag =>
        starter.tags!.some((starterTag: string) => starterTag.toLowerCase() === filterTag.toLowerCase())
      );
      if (!hasMatchingTag) return false;
    }

    return true;
  });
}