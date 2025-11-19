'use client';

import { useState, useCallback, Suspense, useMemo, useRef } from 'react';
import { StarterGrid } from '@/components/StarterGrid';
import { FilterSidebar } from '@/components/FilterSidebar';
import { MobileFilterDrawer } from '@/components/MobileFilterDrawer';
import { SearchBar } from '@/components/SearchBar';
import Loading from '@/components/Loading';
import { HeroSection, HeroSectionRef } from '@/components/HeroSection';

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
  const heroSectionRef = useRef<HeroSectionRef>(null);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    setSearchTerm(search);
  }, []);

  const handleFilterButtonClick = useCallback(() => {
    // Clear all filters when the filter button is clicked
    setFilters({});
  }, []);

  // Calculate active filter count for mobile badge
  const activeFilterCount = useMemo(() => {
    return (filters.language?.length || 0) +
      (filters.category?.length || 0) +
      (filters.framework?.length || 0) +
      (filters.tags?.length || 0);
  }, [filters]);

  // Combine search and filters for StarterGrid
  const combinedFilters = {
    ...filters,
    search: searchTerm
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Full Width */}
      <HeroSection
        ref={heroSectionRef}
        onFiltersChange={handleFiltersChange}
      />

      {/* Constrained Layout Container */}
      <div className="mx-auto max-w-[1448px] px-4 sm:px-6 lg:px-0">
        {/* Main Layout: Sidebar + Content */}
        <div className="flex">
          {/* Left Sidebar - Hidden on Mobile */}
          <aside className="hidden lg:block w-80 bg-content1 min-h-screen sticky top-0" style={{ borderRight: '1px solid #2C2C33' }}>
            <FilterSidebar onFiltersChange={handleFiltersChange} />
          </aside>

          {/* Main Content */}
          <main className="flex-1 lg:p-6 pb-24 lg:pb-6">
            {/* Description Header */}
            <div className="mb-8 lg:mb-10">
              <p className="text-base sm:text-lg max-w-3xl" style={{ color: 'var(--foreground)' }}>
                Jumpstart your app development process with pre-built solutions from Deepgram.
              </p>
            </div>

            {/* Search Bar */}
            <SearchBar className="mb-8 lg:mb-10" onSearchChange={handleSearchChange} />

            <Suspense fallback={<Loading />}>
              <StarterGrid filters={combinedFilters} />
            </Suspense>
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer - Only visible on mobile */}
      <MobileFilterDrawer
        onOpen={handleFilterButtonClick}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
}
