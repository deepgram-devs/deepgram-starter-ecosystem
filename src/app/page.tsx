'use client';

import { useState, useCallback, Suspense } from 'react';
import { StarterGrid } from '@/components/StarterGrid';
import { FilterSidebar } from '@/components/FilterSidebar';
import { SearchBar } from '@/components/SearchBar';
import Loading from '@/components/Loading';
import { HeroSection } from '@/components/HeroSection';

interface FilterState {
  language: string[];
  category: string[];
  framework: string[];
  // vertical: string[]; // TODO: Re-enable when vertical data is available in deepgram.toml
  tags: string[];
}

export default function HomePage() {
  const [filters, setFilters] = useState<Partial<FilterState>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    setSearchTerm(search);
  }, []);

  // Combine search and filters for StarterGrid
  const combinedFilters = {
    ...filters,
    search: searchTerm
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Full Width */}
      <HeroSection />

      {/* Constrained Layout Container */}
      <div className="mx-auto max-w-[1448px]">
        {/* Main Layout: Sidebar + Content */}
        <div className="flex">
          {/* Left Sidebar */}
          <aside className="w-80 bg-content1 min-h-screen sticky top-0" style={{ borderRight: '1px solid #2C2C33' }}>
            <FilterSidebar onFiltersChange={handleFiltersChange} />
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {/* Description Header */}
            <div className="mb-8">
              <p className="text-lg md:text-l max-w-3xl" style={{ color: 'var(--foreground)' }}>
                Jumpstart your app development process with pre-built solutions from Deepgram.
              </p>
            </div>

            {/* Search Bar */}
            <SearchBar onSearchChange={handleSearchChange} />

            <Suspense fallback={<Loading />}>
              <StarterGrid filters={combinedFilters} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
