'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Chip,
  Avatar,
  Divider,
  Link
} from '@nextui-org/react';
import {
  StarIcon,
  CodeBracketIcon,
  BookOpenIcon,
  PlayIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import type { ProcessedStarter } from '@/types';

interface FilterState {
  search?: string;
  language?: string[];
  category?: string[];
  framework?: string[];
  vertical?: string[];
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
        const response = await fetch('/api/starters');

        if (!response.ok) {
          throw new Error(`Failed to fetch starters: ${response.status}`);
        }

        const data = await response.json();
        setStarters(data);
        setFilteredStarters(data);
      } catch (err) {
        console.error('Error fetching starters:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch starters');
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
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(starter =>
        starter.title.toLowerCase().includes(searchTerm) ||
        starter.description.toLowerCase().includes(searchTerm) ||
        starter.name.toLowerCase().includes(searchTerm) ||
        starter.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
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

    // Vertical filter
    if (filters.vertical?.length) {
      filtered = filtered.filter(starter =>
        starter.vertical && filters.vertical?.includes(starter.vertical)
      );
    }



    setFilteredStarters(filtered);
  }, [filters, starters]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };



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

  if (error && starters.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CardBody>
          <h3 className="text-xl font-semibold mb-2 text-danger">Error Loading Starters</h3>
          <p className="text-default-500 mb-4">{error}</p>
          <Button color="primary" onPress={() => window.location.reload()}>
            Try Again
          </Button>
        </CardBody>
      </Card>
    );
  }

  if (filteredStarters.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CardBody>
          <h3 className="text-xl font-semibold mb-2">No Starters Found</h3>
          <p className="text-default-500">
            Try adjusting your filters or search terms to find more starter apps.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="starter-grid-section">
      {!loading && starters.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-default-500">
            {filteredStarters.length} starter{filteredStarters.length !== 1 ? 's' : ''} found
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredStarters.map((starter, index) => (
          <motion.div
            key={starter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start w-full">
                  <div className="flex items-center gap-3">
                    <Avatar
                      size="sm"
                      name={starter.language}
                      className="bg-primary text-white"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{starter.title}</h3>
                      <p className="text-small text-default-500">{starter.language}</p>
                    </div>
                  </div>

                </div>
              </CardHeader>

              <CardBody className="pt-0">
                <p className="text-default-600 text-sm mb-4 line-clamp-3">
                  {starter.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {starter.tags.slice(0, 3).map((tag) => (
                    <Chip key={tag} size="sm" variant="flat" color="secondary">
                      {tag}
                    </Chip>
                  ))}
                  {starter.tags.length > 3 && (
                    <Chip size="sm" variant="flat" color="default">
                      +{starter.tags.length - 3}
                    </Chip>
                  )}
                </div>

                {/* Framework & Category */}
                {(starter.framework || starter.category) && (
                  <div className="flex gap-2 mb-4">
                    {starter.framework && (
                      <Chip size="sm" variant="bordered" color="primary">
                        {starter.framework}
                      </Chip>
                    )}
                    {starter.category && (
                      <Chip size="sm" variant="bordered" color="warning">
                        {starter.category}
                      </Chip>
                    )}
                  </div>
                )}

                <Divider className="my-3" />

                {/* Stats */}
                <div className="flex justify-between items-center text-small text-default-500">
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4" />
                    <span>{starter.stats.stars}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>{formatDate(starter.stats.lastUpdated)}</span>
                  </div>
                </div>
              </CardBody>

              <CardFooter className="pt-0">
                <div className="flex gap-2 w-full">
                  <Button
                    as={Link}
                    href={starter.links.github}
                    target="_blank"
                    variant="solid"
                    color="primary"
                    size="sm"
                    startContent={<CodeBracketIcon className="w-4 h-4" />}
                    className="flex-1"
                  >
                    Code
                  </Button>

                  {starter.links.docs && (
                    <Button
                      as={Link}
                      href={starter.links.docs}
                      target="_blank"
                      variant="bordered"
                      size="sm"
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
                      size="sm"
                      startContent={<PlayIcon className="w-4 h-4" />}
                    >
                      Demo
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
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
      vertical: 'Call Center',
      tags: ['real-time', 'websocket', 'ai', 'voice'],
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
      vertical: 'Drive-Thru',

      tags: ['python', 'fastapi', 'real-time', 'ordering'],
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
      vertical: 'Meeting Notes',
      tags: ['javascript', 'react', 'transcription', 'ai'],
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