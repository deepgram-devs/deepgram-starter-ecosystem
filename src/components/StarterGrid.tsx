'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Chip,
  Divider,
  Link
} from '@nextui-org/react';
import {
  BookOpenIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import type { ProcessedStarter } from '@/types';
import { LanguageIcon, getLanguageIconBg, getLanguageIconSize } from '@/components/icons/LanguageIconMapper';

interface FilterState {
  search?: string;
  language?: string[];
  category?: string[];
  framework?: string[];
  // vertical?: string[]; // TODO: Re-enable when vertical data is available in deepgram.toml
  tags?: string[];
}

interface StarterGridProps {
  filters?: FilterState;
}

export function StarterGrid({ filters }: StarterGridProps) {
  const [starters, setStarters] = useState<ProcessedStarter[]>([]);
  const [filteredStarters, setFilteredStarters] = useState<ProcessedStarter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch starters from API
  useEffect(() => {
    const fetchStarters = async () => {
      try {
        setLoading(true);
        setError(null); // Clear any previous errors
        const response = await fetch('/api/starters');

        if (!response.ok) {
          let errorMessage = 'Unable to load starters at the moment';

          if (response.status === 404) {
            errorMessage = 'No starter repositories found. This might be temporary - GitHub API might be rate limited.';
          } else if (response.status === 500) {
            errorMessage = 'Server error occurred while loading starters. Please try again.';
          } else if (response.status === 403) {
            errorMessage = 'GitHub API access limited. Some features may not work as expected.';
          }

          console.warn(`API responded with ${response.status}: ${response.statusText}`);

          // Try to get error details from response
          try {
            const errorData = await response.json();
            if (errorData.message) {
              console.log('API Error details:', errorData.message);
            }
          } catch {
            // Ignore JSON parsing errors
          }

          setError(errorMessage);
          // Gracefully fall back to mock data
          const mockStarters = generateMockStarters();
          setStarters(mockStarters);
          setFilteredStarters(mockStarters);
          return; // Don't throw, just handle gracefully
        }

        const data = await response.json();
        setStarters(data);
        setFilteredStarters(data);
      } catch (err) {
        console.error('Network error fetching starters:', err);
        setError('Network connection issue. Using offline examples for now.');
        // For development, use mock data if API fails
        const mockStarters = generateMockStarters();
        setStarters(mockStarters);
        setFilteredStarters(mockStarters);
      } finally {
        setLoading(false);
      }
    };

    fetchStarters();
  }, []);

  // Apply filters
  useEffect(() => {
    if (!filters) {
      setFilteredStarters(starters);
      return;
    }

    let filtered = starters;

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase().trim();

      filtered = filtered.filter(starter => {
        const title = starter.title.toLowerCase();
        const description = starter.description.toLowerCase();
        const name = starter.name.toLowerCase();
        const language = starter.language.toLowerCase();
        const framework = starter.framework?.toLowerCase() || '';
        const category = starter.category?.toLowerCase() || '';

        // Search across all relevant fields
        return title.includes(searchTerm) ||
          description.includes(searchTerm) ||
          name.includes(searchTerm) ||
          language.includes(searchTerm) ||
          framework.includes(searchTerm) ||
          category.includes(searchTerm);
      });
    }

    // Language filter
    if (filters.language?.length) {
      filtered = filtered.filter(starter =>
        filters.language?.includes(starter.language)
      );
    }

    // Category filter
    if (filters.category?.length) {
      filtered = filtered.filter(starter =>
        starter.category && filters.category?.includes(starter.category)
      );
    }

    // Framework filter
    if (filters.framework?.length) {
      filtered = filtered.filter(starter =>
        starter.framework && filters.framework?.includes(starter.framework)
      );
    }

    // TODO: Re-enable when vertical data is available in deepgram.toml
    // Vertical filter
    // if (filters.vertical?.length) {
    //   filtered = filtered.filter(starter =>
    //     starter.vertical && filters.vertical?.includes(starter.vertical)
    //   );
    // }

    setFilteredStarters(filtered);
  }, [filters, starters]);

  // Remove unused formatDate helper


  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardBody className="p-6">
              <div className="h-4 bg-default-200 rounded mb-4"></div>
              <div className="h-3 bg-default-200 rounded mb-2"></div>
              <div className="h-3 bg-default-200 rounded mb-4"></div>
              <div className="h-8 bg-default-200 rounded"></div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  // Show a notification banner if there was an error but we have fallback data
  const ErrorBanner = () => (
    <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-3 h-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm text-yellow-200 mb-2">
            <strong>Using offline examples:</strong> {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-yellow-300 hover:text-yellow-100 underline min-h-[44px] py-2"
          >
            Try refreshing to load live data
          </button>
        </div>
        <button
          onClick={() => setError(null)}
          className="text-yellow-400 hover:text-yellow-200 text-sm"
        >
          ✕
        </button>
      </div>
    </div>
  );

  if (error && starters.length === 0) {
    return (
      <Card className="p-8 text-center bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
        <CardBody>
          <div className="mb-4">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-3 text-white">Temporarily Unavailable</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto leading-relaxed">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              className="btn-brand min-w-32 min-h-[44px]"
              onPress={() => window.location.reload()}
            >
              Try Again
            </Button>
            <Button
              variant="bordered"
              onPress={() => {
                setError(null);
                const mockStarters = generateMockStarters();
                setStarters(mockStarters);
                setFilteredStarters(mockStarters);
              }}
              className="min-w-32 min-h-[44px]"
            >
              View Examples
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (filteredStarters.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CardBody>
          <h3 className="text-xl font-semibold mb-2">No Starters Found</h3>
          <p style={{ color: 'var(--foreground)' }}>
            Try adjusting your filters or search terms to find more starter apps.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="starter-grid-section">
      {error && starters.length > 0 && <ErrorBanner />}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStarters.map((starter, index) => (
          <motion.div
            key={starter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div
              className="starter-card-hover cursor-pointer"
              onClick={(e) => {
                // Only navigate if the click is on the card background, not on interactive elements
                if ((e.target as HTMLElement).closest('button, a')) {
                  return;
                }
                window.location.href = `/starters/${starter.name}`;
              }}
            >
              <Card
                // min height for even sizing in cards
                className="h-full min-h-[320px] transition-all duration-300 rounded-lg"
                style={{ backgroundColor: 'var(--panel)' }}
              >
                {/* Language Icon */}
                <div className={`w-full h-16 ${getLanguageIconBg()} rounded-t-lg flex items-center justify-center shadow-sm`}>
                  <LanguageIcon
                    language={starter.language}
                    className={`${getLanguageIconSize(starter.language)} text-white/70 drop-shadow-sm`}
                  />
                </div>

                <CardHeader className="pb-1 px-4 pt-3">
                  {/* min-h-[56px] accommodates up to 2 rows of title */}
                  <h3 className="font-semibold text-lg text-left line-clamp-2 min-h-[56px]">{starter.title}</h3>
                </CardHeader>

                <CardBody className="pt-0 px-4 pb-2">
                  <p className="text-sm mb-3 line-clamp-3 min-h-[48px]" style={{ color: 'var(--foreground)' }}>
                    {starter.description}
                  </p>

                  {/* Star count - between description and chips */}
                  <div className="flex items-center gap-2 mb-3" style={{ color: 'var(--foreground)' }}>
                    <StarIcon className="w-6 h-6 text-star" />
                    <span className="text-sm font-medium">{starter.stats.stars}</span>
                  </div>

                  {/* Framework & Category */}
                  {(starter.language || starter.framework || starter.category) && (
                    // min-h-[56px] accommodates up to 2 rows of tags
                    <div className="flex flex-wrap gap-2 mb-2 min-h-[56px]">
                      {starter.language && (
                        <Chip size="sm" variant="solid" color="default" className="font-semibold px-3" style={{ backgroundColor: 'var(--language-label)', color: 'var(--background)' }}>
                          {starter.language}
                        </Chip>
                      )}
                      {starter.framework && (
                        <Chip size="sm" variant="solid" color="default" className="font-semibold px-3" style={{ backgroundColor: 'var(--language-label)', color: 'var(--background)' }}>
                          {starter.framework}
                        </Chip>
                      )}
                      {starter.category && (
                        <Chip size="sm" variant="solid" color="default" className="font-semibold px-3" style={{ backgroundColor: 'var(--language-label)', color: 'var(--background)' }}>
                          {starter.category}
                        </Chip>
                      )}
                    </div>
                  )}

                  <Divider className="my-2" />
                </CardBody>

                <CardFooter className="pt-0 pb-3 px-4">
                  <div className="flex flex-col gap-2 w-full items-start">
                    {/* Primary CTA - View Starter */}
                    <Button
                      className="btn-magenta-gradient font-semibold min-h-[44px]"
                      onPress={() => window.location.href = `/starters/${starter.name}`}
                      size="md"
                    >
                      View Starter
                    </Button>

                    {/* Secondary actions - Docs and Demo */}
                    {(starter.links.docs || starter.links.demo) && (
                      <div className="flex gap-2 w-full">
                        {starter.links.docs && (
                          <Button
                            as={Link}
                            href={starter.links.docs}
                            target="_blank"
                            variant="bordered"
                            size="md"
                            className="min-h-[44px]"
                            startContent={<BookOpenIcon className="w-4 h-4" />}
                          >
                            Docs
                          </Button>
                        )}

                        {starter.links.demo && (
                          <Button
                            as={Link}
                            href={starter.links.demo}
                            target="_blank"
                            variant="bordered"
                            size="md"
                            className="min-h-[44px]"
                            startContent={<PlayIcon className="w-4 h-4" />}
                          >
                            Demo
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Mock data for development/fallback
function generateMockStarters(): ProcessedStarter[] {
  return [
    {
      id: 1,
      name: 'voice-agent-typescript',
      title: 'Voice Agent TypeScript',
      description: 'A real-time voice agent built with TypeScript and WebSockets for conversational AI applications.',
      language: 'TypeScript',
      framework: 'Next.js',
      category: 'Voice Agent',
      // TODO: Re-enable when vertical data is available in deepgram.toml
      // vertical: 'Call Center',
      links: {
        github: 'https://github.com/deepgram-starters/voice-agent-typescript',
        docs: 'https://docs.deepgram.com',
        demo: 'https://demo.deepgram.com',
      },
      stats: {
        stars: 45,
        forks: 12,
        lastUpdated: '2024-07-15T10:30:00Z',
      },
    },
    {
      id: 2,
      name: 'drive-thru-python',
      title: 'Drive-Thru Assistant',
      description: 'Python-based drive-thru voice ordering system with real-time speech recognition and response generation.',
      language: 'Python',
      framework: 'FastAPI',
      category: 'Real-time',
      // TODO: Re-enable when vertical data is available in deepgram.toml
      // vertical: 'Food / Hospitality / Gyms',
      links: {
        github: 'https://github.com/deepgram-starters/drive-thru-python',
        docs: 'https://docs.deepgram.com',
      },
      stats: {
        stars: 32,
        forks: 8,
        lastUpdated: '2024-07-20T14:22:00Z',
      },
    },
    {
      id: 3,
      name: 'meeting-notes-js',
      title: 'Meeting Notes Generator',
      description: 'JavaScript application that transcribes meetings and generates summaries with key action items.',
      language: 'JavaScript',
      framework: 'React',
      category: 'Batch Processing',
      // TODO: Re-enable when vertical data is available in deepgram.toml
      // vertical: 'Meeting Notes',
      links: {
        github: 'https://github.com/deepgram-starters/meeting-notes-js',
        demo: 'https://demo.deepgram.com/meetings',
      },
      stats: {
        stars: 67,
        forks: 23,
        lastUpdated: '2024-07-18T09:15:00Z',
      },
    },
    // Add more mock starters as needed
  ];
}