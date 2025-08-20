'use client';

import { useState, useCallback, Suspense } from 'react';
import { StarterGrid } from '@/components/StarterGrid';
import { FilterSidebar } from '@/components/FilterSidebar';
import Loading from '@/components/Loading';
import { HeroSection } from '@/components/HeroSection';

interface FilterState {
  search: string;
  language: string[];
  category: string[];
  framework: string[];
  vertical: string[];
  tags: string[];
}

export default function HomePage() {
  const [filters, setFilters] = useState<Partial<FilterState>>({});

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Full Width */}
      <HeroSection />

      {/* Constrained Layout Container */}
      <div className="mx-auto max-w-[1448px]">
        {/* Main Layout: Sidebar + Content */}
        <div className="flex">
          {/* Left Sidebar */}
          <aside className="w-96 border-r border-divider bg-content1 min-h-screen sticky top-0">
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

            <Suspense fallback={<Loading />}>
              <StarterGrid filters={filters} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
