'use client';

import { useState, useCallback, Suspense } from 'react';
import { StarterGrid } from '@/components/StarterGrid';
import { FilterSidebar } from '@/components/FilterSidebar';
import Loading from '@/components/Loading';

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
      {/* Simple Header */}
      <header className="border-b border-divider">
        <div className="container mx-auto px-6 py-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Find your Starter
          </h1>
          <p className="text-lg text-default-500">
            Jumpstart your app development process with pre-built solutions from Deepgram.
          </p>
        </div>
      </header>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-80 border-r border-divider bg-content1 min-h-screen sticky top-0">
          <FilterSidebar onFiltersChange={handleFiltersChange} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Suspense fallback={<Loading />}>
            <StarterGrid filters={filters} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
