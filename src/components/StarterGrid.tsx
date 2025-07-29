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
  PlayIcon
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
        starter.name.toLowerCase().includes(searchTerm)
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
      <div className="mx-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredStarters.map((starter, index) => (
          <motion.div
            key={starter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="p-1 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 rounded-lg">
              <Card className="h-full min-h-[400px] hover:shadow-lg transition-shadow duration-300 bg-black rounded-lg">
                {/* Logo Placeholder */}
                <div className="w-full h-20 bg-gray-300 rounded-t-lg flex items-center justify-center">
                  {/* Starter languageLogo will go here */}
                </div>

                <CardHeader className="pb-2 px-6 pt-4">
                  <h3 className="font-semibold text-lg text-left">{starter.title}</h3>
                </CardHeader>

                <CardBody className="pt-0 px-6">
                  <p className="text-default-600 text-sm mb-4 line-clamp-3 min-h-[60px]">
                    {starter.description}
                  </p>

                  {/* Framework & Category */}
                  {(starter.language || starter.framework || starter.category) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {starter.language && (
                        <Chip size="sm" variant="solid" color="default" className="font-semibold bg-gray-600 text-white px-3">
                          {starter.language}
                        </Chip>
                      )}
                      {starter.framework && (
                        <Chip size="sm" variant="solid" color="default" className="font-semibold bg-gray-600 text-white px-3">
                          {starter.framework}
                        </Chip>
                      )}
                      {starter.category && (
                        <Chip size="sm" variant="solid" color="default" className="font-semibold bg-gray-600 text-white px-3">
                          {starter.category}
                        </Chip>
                      )}
                    </div>
                  )}

                  <Divider className="my-3" />
                </CardBody>

                <CardFooter className="pt-0 pb-4 px-6">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-1 text-small text-default-500">
                      <StarIcon className="w-4 h-4" />
                      <span>{starter.stats.stars}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-1 whitespace-nowrap"
                        as={Link}
                        href={starter.links.github}
                        target="_blank"
                        variant="solid"
                        color="primary"
                        size="sm"
                        startContent={<CodeBracketIcon className="w-4 h-4" />}
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
      vertical: 'Call Center',
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