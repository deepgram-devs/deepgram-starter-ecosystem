'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { HeroSection } from '@/components/HeroSection';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Divider,
  Link,
  Spinner,
  // Dropdown,
  // DropdownTrigger,
  // DropdownMenu,
  // DropdownItem
} from '@nextui-org/react';
import {
  CodeBracketIcon,
  BookOpenIcon,
  PlayIcon,
  ArrowLeftIcon,
  // ChevronDownIcon,
  // RocketLaunchIcon
} from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { ProcessedStarter } from '@/types';

// Import highlight.js CSS for code syntax highlighting
import 'highlight.js/styles/github-dark.css';

interface ReadmeData {
  content: string;
  encoding: string;
}

export default function StarterDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [starter, setStarter] = useState<ProcessedStarter | null>(null);
  const [readme, setReadme] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStarterData = async () => {
      try {
        setLoading(true);

        // Fetch all starters to find the specific one
        const startersResponse = await fetch('/api/starters');
        if (!startersResponse.ok) {
          throw new Error('Failed to fetch starters');
        }

        const starters: ProcessedStarter[] = await startersResponse.json();
        const currentStarter = starters.find(s => s.name === slug);

        if (!currentStarter) {
          setError(`Starter "${slug}" not found. It may have been moved or doesn't exist.`);
          setLoading(false);
          return;
        }

        setStarter(currentStarter);

        // Fetch README content
        const readmeResponse = await fetch(`/api/starters/${slug}/readme`);
        if (readmeResponse.ok) {
          const readmeData: ReadmeData = await readmeResponse.json();
          const content = readmeData.encoding === 'base64'
            ? new TextDecoder('utf-8').decode(Uint8Array.from(atob(readmeData.content), c => c.charCodeAt(0)))
            : readmeData.content;
          setReadme(content);
        } else {
          setReadme('No README found for this starter.');
        }

      } catch (err) {
        console.error('Error fetching starter data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load starter');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchStarterData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !starter) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Full Width */}
      <HeroSection />

      {/* Constrained Layout Container */}
      <div className="mx-auto max-w-[1448px]">
        <div className="flex">
          {/* Left Sidebar */}
          <aside className="w-96 min-h-screen bg-content1 p-4 overflow-hidden">
            <div className="sticky top-0">
              {/* Back Button */}
              <Link
                href="/"
                className="mb-2 link-brand text-base px-3 py-2 rounded-lg flex items-center gap-2 w-fit"
              >
                <ArrowLeftIcon className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">Back to Starters</span>
              </Link>

              {/* Starter Info Card */}
              <div className="p-1 rounded-lg mb-4" style={{ backgroundColor: 'var(--border-color)' }}>
                <Card className="bg-black border-none">
                  <CardHeader className="bg-black flex justify-center items-center">
                    <h2 className="text-xl font-bold text-white">{starter.title}</h2>
                  </CardHeader>
                  <CardBody className="pt-0 bg-black p-6">
                    <p className="text-secondary text-sm mb-4">
                      {starter.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
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

                    <Divider className="my-4" />

                    {/* Stats */}
                    <div className="text-sm text-secondary">
                      <div className="flex justify-between mb-1">
                        <span>Stars:</span>
                        <span>{starter.stats.stars}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Forks:</span>
                        <span>{starter.stats.forks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Updated:</span>
                        <span>{new Date(starter.stats.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <Divider className="my-4" />

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button
                        as={Link}
                        href={starter.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full btn-magenta-gradient px-4 py-2 flex items-center justify-center gap-2"
                        startContent={<CodeBracketIcon className="w-4 h-4 flex-shrink-0" />}
                      >
                        <span className="whitespace-nowrap">View on GitHub</span>
                      </Button>

                      {starter.links.docs && (
                        <Link
                          href={starter.links.docs}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full border border-gray-600 hover:border-gray-500 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <BookOpenIcon className="w-4 h-4 flex-shrink-0" />
                          <span className="whitespace-nowrap">Documentation</span>
                        </Link>
                      )}

                      {starter.links.demo && (
                        <Link
                          href={starter.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full border border-gray-600 hover:border-gray-500 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <PlayIcon className="w-4 h-4 flex-shrink-0" />
                          <span className="whitespace-nowrap">Live Demo</span>
                        </Link>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* TOML Configuration Display */}
              <div className="p-1 rounded-lg" style={{ backgroundColor: 'var(--border-color)' }}>
                <Card className="bg-black border-none">
                  <CardHeader className="bg-black flex justify-center items-center">
                    <h3 className="text-lg font-semibold text-white">Configuration</h3>
                  </CardHeader>
                  <CardBody className="pt-0 bg-black p-6">
                    <div className="space-y-4 text-sm">
                      {/* Build Command */}
                      {starter.config?.build?.command && (
                        <div>
                          <span className="font-medium text-secondary">Build Command:</span>
                          <div className="mt-1">
                            <code className="bg-gray-800 text-emerald-400 px-2 py-1 rounded text-sm font-mono">
                              {starter.config.build.command}
                            </code>
                          </div>
                        </div>
                      )}

                      {/* Requirements */}
                      {(starter.config?.requirements?.node || starter.config?.requirements?.python) && (
                        <div>
                          <span className="font-medium text-secondary">Requirements:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {starter.config.requirements.node && (
                              <Chip size="sm" variant="solid" color="default" style={{ backgroundColor: 'var(--language-label)', color: 'var(--background)' }}>
                                Node {starter.config.requirements.node}
                              </Chip>
                            )}
                            {starter.config.requirements.python && (
                              <Chip size="sm" variant="solid" color="default" style={{ backgroundColor: 'var(--language-label)', color: 'var(--background)' }}>
                                Python {starter.config.requirements.python}
                              </Chip>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Dependencies */}
                      {starter.config?.requirements?.dependencies && starter.config.requirements.dependencies.length > 0 && (
                        <div>
                          <span className="font-medium text-secondary">Dependencies:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {starter.config.requirements.dependencies.map((dep, index) => (
                              <Chip key={index} size="sm" variant="solid" color="default" style={{ backgroundColor: 'var(--language-label)', color: 'var(--background)' }}>
                                {dep}
                              </Chip>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Author */}
                      {starter.config?.author && (
                        <div>
                          <span className="font-medium text-secondary">Author:</span>
                          <div className="mt-1 text-secondary">
                            {starter.config.author.name && (
                              <div>{starter.config.author.name}</div>
                            )}
                            {starter.config.author.github && (
                              <div>
                                <a
                                  href={`https://github.com/${starter.config.author.github}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  @{starter.config.author.github}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Post-build message */}
                      {starter.config?.["post-build"]?.message && (
                        <div>
                          <span className="font-medium text-secondary">Setup Notes:</span>
                          <div className="mt-1 p-2 bg-gray-800 rounded text-secondary text-xs">
                            {starter.config["post-build"].message}
                          </div>
                        </div>
                      )}

                      {/* Deployment info (if available) */}
                      {starter.deployment?.platforms && (
                        <div>
                          <span className="font-medium text-secondary">Platforms:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {starter.deployment.platforms.map((platform, index) => (
                              <Chip key={index} size="sm" variant="solid" color="default" style={{ backgroundColor: 'var(--language-label)', color: 'var(--background)' }}>
                                {platform}
                              </Chip>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Show message if no useful config data */}
                      {!starter.config?.build?.command &&
                        !starter.config?.requirements?.node &&
                        !starter.config?.requirements?.python &&
                        !starter.config?.requirements?.dependencies?.length &&
                        !starter.config?.author &&
                        !starter.config?.["post-build"]?.message &&
                        !starter.deployment?.platforms && (
                          <div className="text-secondary text-center py-4">
                            No configuration data available for this starter.
                          </div>
                        )}
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Deploy Section */}
              {/* TODO: Deploy feature not yet implemented.  This is a placeholder for future integration work we need to do to support deploying to these platforms.
              <div className="p-1 rounded-lg mt-6" style={{ backgroundColor: 'var(--border-color)' }}>
                <Card className="bg-black border-none">
                  <CardHeader className="bg-black flex justify-center items-center">
                    <h3 className="text-lg font-semibold text-white">Deploy</h3>
                  </CardHeader>
                  <CardBody className="pt-0 bg-black p-6">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          className="w-full btn-magenta-gradient px-4 py-2 flex items-center justify-center gap-2"
                          startContent={<RocketLaunchIcon className="w-4 h-4 flex-shrink-0" />}
                          endContent={<ChevronDownIcon className="w-4 h-4 flex-shrink-0" />}
                        >
                          <span className="whitespace-nowrap">Choose Platform</span>
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Deploy platforms"
                        className="bg-black border border-gray-700"
                        onAction={(key) => {
                          // TODO: Handle deployment platform selection
                          console.log('Selected platform:', key);
                        }}
                      >
                        <DropdownItem
                          key="digitalocean"
                          startContent={<div className="w-3 h-3 bg-magenta-purple rounded-sm flex-shrink-0"></div>}
                          className="text-white hover:bg-magenta-purple/10"
                        >
                          Digital Ocean
                        </DropdownItem>
                        <DropdownItem
                          key="fly"
                          startContent={<div className="w-3 h-3 bg-magenta-purple rounded-sm flex-shrink-0"></div>}
                          className="text-white hover:bg-magenta-purple/10"
                        >
                          Fly.io
                        </DropdownItem>
                        <DropdownItem
                          key="vercel"
                          startContent={<div className="w-3 h-3 bg-black border border-white rounded-sm flex-shrink-0"></div>}
                          className="text-white hover:bg-gray-500/10"
                        >
                          Vercel
                        </DropdownItem>
                        <DropdownItem
                          key="aws"
                          startContent={<div className="w-3 h-3 bg-orange-500 rounded-sm flex-shrink-0"></div>}
                          className="text-white hover:bg-orange-500/10"
                        >
                          AWS
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </CardBody>
                </Card>
              </div>
              */}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="max-w-5xl mx-auto">
              <div className="p-1 rounded-lg" style={{ backgroundColor: 'var(--border-color)' }}>
                <Card className="min-h-[600px] bg-black border-none">
                  <CardHeader className="bg-black border-b border-gray-700 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center ml-3 mt-2" style={{ backgroundColor: 'var(--border-color)' }}>
                        <BookOpenIcon className="w-5 h-5 text-white" />
                      </div>
                      <h1 className="text-2xl font-bold text-white">README</h1>
                    </div>
                  </CardHeader>
                  <CardBody className="p-8 bg-black">
                    <div
                      className="prose prose-lg prose-invert max-w-none
                             prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
                             prose-h1:text-3xl prose-h1:mb-8 prose-h1:mt-0
                             prose-h2:text-2xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:border-b prose-h2:border-gray-700 prose-h2:pb-3
                             prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-8
                             prose-p:leading-loose prose-p:mb-6
                             prose-strong:text-white prose-strong:font-semibold
                             prose-code:text-emerald-400 prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
                             prose-pre:bg-gray-900 prose-pre:rounded prose-pre:p-2 prose-pre:overflow-x-auto prose-pre:my-6
                             prose-ul:mb-6
                             prose-ol:mb-6
                             prose-li:mb-2 prose-li:leading-loose
                             prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-gray-800/50 prose-blockquote:p-4 prose-blockquote:rounded-r prose-blockquote:mb-6
                             prose-img:rounded-lg prose-img:shadow-lg prose-img:mb-6"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {readme ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            // Custom component overrides for better styling
                            code({ className, children, ...props }) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !("inline" in props && props.inline) && match ? (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              ) : (
                                <code className="bg-gray-800 text-emerald-400 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                                  {children}
                                </code>
                              );
                            },
                            a({ children, href, ...props }) {
                              return (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 underline decoration-2 decoration-blue-400/50 hover:decoration-blue-300"
                                  {...props}
                                >
                                  {children}
                                </a>
                              );
                            },
                            h1({ children, ...props }) {
                              return (
                                <h1 className="text-3xl font-bold text-white mb-8 mt-0" {...props}>
                                  {children}
                                </h1>
                              );
                            },
                            h2({ children, ...props }) {
                              return (
                                <h2 className="text-2xl font-bold text-white mb-6 mt-10 pb-3 border-b border-gray-700" {...props}>
                                  {children}
                                </h2>
                              );
                            },
                            h3({ children, ...props }) {
                              return (
                                <h3 className="text-xl font-semibold text-white mb-4 mt-8" {...props}>
                                  {children}
                                </h3>
                              );
                            },
                            pre({ children, ...props }) {
                              return (
                                <pre className="bg-gray-900 rounded p-2 overflow-x-auto text-sm my-6 font-mono" {...props}>
                                  {children}
                                </pre>
                              );
                            },
                            ul({ children, ...props }) {
                              return (
                                <ul className="list-disc list-inside space-y-3 mb-6" style={{ color: 'var(--foreground)' }} {...props}>
                                  {children}
                                </ul>
                              );
                            },
                            ol({ children, ...props }) {
                              return (
                                <ol className="list-decimal list-inside space-y-3 mb-6" style={{ color: 'var(--foreground)' }} {...props}>
                                  {children}
                                </ol>
                              );
                            },
                            li({ children, ...props }) {
                              return (
                                <li className="leading-loose" {...props}>
                                  {children}
                                </li>
                              );
                            },
                            img({ src, alt, ...props }) {
                              // Check if this is a badge (common badge services)
                              const isBadge = src && typeof src === "string" && (
                                src.includes('badge') ||
                                src.includes('shield') ||
                                src.includes('dcbadge') ||
                                alt?.toLowerCase().includes('badge') ||
                                alt?.toLowerCase().includes('discord')
                              );

                              return (
                                // eslint-disable-next-line @next/next/no-img-element -- These images are arbitrary, so defining widths and allowed hosts is impossible.
                                <img
                                  src={typeof src === 'string' ? src : ''}
                                  alt={alt || 'Image'}
                                  className={isBadge
                                    ? "inline-block align-middle mr-2 max-h-6"
                                    : "rounded-lg shadow-lg mb-6 max-w-full h-auto block"
                                  }
                                  loading="lazy"
                                  onError={(e) => {
                                    console.warn('Image failed to load:', src, 'Alt text:', alt);
                                    // For badges, show a styled fallback
                                    if (isBadge && alt) {
                                      const fallback = document.createElement('span');
                                      fallback.textContent = alt;
                                      fallback.className = 'inline-block px-2 py-1 bg-blue-600 mb-4 text-white text-xs rounded mr-2 font-medium';
                                      fallback.title = `Badge: ${alt} (Image failed to load from ${src})`;
                                      e.currentTarget.parentNode?.replaceChild(fallback, e.currentTarget);
                                    } else {
                                      // For regular images, show a placeholder
                                      const placeholder = document.createElement('div');
                                      placeholder.className = 'bg-gray-800 border border-gray-700 rounded-lg p-4 text-center text-gray-400 mb-6';
                                      placeholder.innerHTML = `
                                      <div class="text-sm">📷 Image not available</div>
                                      <div class="text-xs mt-1">${alt || 'No description'}</div>
                                    `;
                                      e.currentTarget.parentNode?.replaceChild(placeholder, e.currentTarget);
                                    }
                                  }}
                                  {...props}
                                />
                              );
                            },
                          }}
                        >
                          {readme}
                        </ReactMarkdown>
                      ) : (
                        <div className="text-center py-12">
                          <BookOpenIcon className="w-16 h-16 text-secondary mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-secondary mb-2">No README Available</h3>
                          <p className="text-secondary">This starter doesn&apos;t have a README file yet.</p>
                          <Button
                            as={Link}
                            href={starter.links.github}
                            target="_blank"
                            variant="bordered"
                            className="mt-4"
                            startContent={<CodeBracketIcon className="w-4 h-4" />}
                          >
                            View Source Code
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}