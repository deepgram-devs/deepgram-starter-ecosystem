'use client';

import { useState, useEffect } from 'react';
import {
  Input,
  Accordion,
  AccordionItem,
  Checkbox,
  CheckboxGroup,
  Chip,
  Divider
} from '@nextui-org/react';
import {
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface FilterOptions {
  languages: string[];
  categories: string[];
  frameworks: string[];
  verticals: string[];
  tags: string[];
}

interface FilterState {
  search: string;
  language: string[];
  category: string[];
  framework: string[];
  vertical: string[];
  tags: string[];
}

interface FilterSidebarProps {
  onFiltersChange?: (filters: FilterState) => void;
}

export function FilterSidebar({ onFiltersChange }: FilterSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [selectedVerticals, setSelectedVerticals] = useState<string[]>([]);

  // Mock filter options - in real app, these would come from API
  const filterOptions: FilterOptions = {
    languages: ['JavaScript', 'Python', 'TypeScript', 'Go', 'Java', 'C#', 'PHP', 'Ruby'],
    categories: ['Voice Agent', 'Real-time', 'Batch Processing', 'Analytics', 'Streaming'],
    frameworks: ['Next.js', 'React', 'Express', 'FastAPI', 'Django', 'Vue.js', 'Svelte'],
    verticals: ['Drive-Thru', 'Call Center', 'Meeting Notes', 'Podcasts', 'Education'],
    tags: ['real-time', 'websocket', 'streaming', 'api', 'webhook', 'ai', 'nlp']
  };

  // Update parent component when filters change
  useEffect(() => {
    const filters = {
      search: searchTerm,
      language: selectedLanguages,
      category: selectedCategories,
      framework: selectedFrameworks,
      vertical: selectedVerticals,
      tags: [],
    };
    onFiltersChange?.(filters);
  }, [
    searchTerm,
    selectedLanguages,
    selectedCategories,
    selectedFrameworks,
    selectedVerticals,
    onFiltersChange
  ]);

  const hasActiveFilters =
    searchTerm ||
    selectedLanguages.length ||
    selectedCategories.length ||
    selectedFrameworks.length ||
    selectedVerticals.length;

  return (
    <div className="p-6 h-full">
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Filter Starters</h2>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="border border-default-300 bg-default-100 rounded-lg p-1">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startContent={<MagnifyingGlassIcon className="w-4 h-4 text-default-400" />}
            variant="flat"
            size="sm"
            classNames={{
              inputWrapper: "bg-transparent border-none shadow-none"
            }}
          />
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mb-6">
          <p className="text-sm font-medium text-foreground mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-1">
            {searchTerm && (
              <Chip
                size="sm"
                variant="flat"
                onClose={() => setSearchTerm('')}
                startContent={<MagnifyingGlassIcon className="w-3 h-3" />}
              >
                &quot;{searchTerm}&quot;
              </Chip>
            )}
            {selectedLanguages.map((lang) => (
              <Chip
                key={lang}
                size="sm"
                variant="flat"
                color="primary"
                onClose={() => setSelectedLanguages(prev => prev.filter(l => l !== lang))}
              >
                {lang}
              </Chip>
            ))}
            {selectedCategories.map((category) => (
              <Chip
                key={category}
                size="sm"
                variant="flat"
                color="secondary"
                onClose={() => setSelectedCategories(prev => prev.filter(c => c !== category))}
              >
                {category}
              </Chip>
            ))}
            {selectedFrameworks.map((framework) => (
              <Chip
                key={framework}
                size="sm"
                variant="flat"
                color="success"
                onClose={() => setSelectedFrameworks(prev => prev.filter(f => f !== framework))}
              >
                {framework}
              </Chip>
            ))}
            {selectedVerticals.map((vertical) => (
              <Chip
                key={vertical}
                size="sm"
                variant="flat"
                color="warning"
                onClose={() => setSelectedVerticals(prev => prev.filter(v => v !== vertical))}
              >
                {vertical}
              </Chip>
            ))}
          </div>
          <Divider className="mt-4" />
        </div>
      )}

      {/* Filter Accordion */}
      <Accordion variant="light" selectionMode="multiple" defaultExpandedKeys={["language"]}>
        {/* Language Filter */}
        <AccordionItem
          key="language"
          aria-label="Language"
          title={
            <div className="flex items-center justify-between w-full">
              <span>Language</span>
              {selectedLanguages.length > 0 && (
                <Chip size="sm" variant="flat" color="default" className="ml-2">
                  {selectedLanguages.length}
                </Chip>
              )}
            </div>
          }
        >
          <CheckboxGroup
            value={selectedLanguages}
            onValueChange={setSelectedLanguages}
            size="sm"
          >
            {filterOptions.languages.map((lang) => (
              <Checkbox key={lang} value={lang} className="w-full">
                {lang}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </AccordionItem>

        {/* Use Case Filter */}
        <AccordionItem
          key="category"
          aria-label="Use Case"
          title={
            <div className="flex items-center justify-between w-full">
              <span>Use Case</span>
              {selectedCategories.length > 0 && (
                <Chip size="sm" variant="flat" color="default" className="ml-2">
                  {selectedCategories.length}
                </Chip>
              )}
            </div>
          }
        >
          <CheckboxGroup
            value={selectedCategories}
            onValueChange={setSelectedCategories}
            size="sm"
          >
            {filterOptions.categories.map((category) => (
              <Checkbox key={category} value={category} className="w-full">
                {category}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </AccordionItem>

        {/* Framework Filter */}
        <AccordionItem
          key="framework"
          aria-label="Framework"
          title={
            <div className="flex items-center justify-between w-full">
              <span>Framework</span>
              {selectedFrameworks.length > 0 && (
                <Chip size="sm" variant="flat" color="default" className="ml-2">
                  {selectedFrameworks.length}
                </Chip>
              )}
            </div>
          }
        >
          <CheckboxGroup
            value={selectedFrameworks}
            onValueChange={setSelectedFrameworks}
            size="sm"
          >
            {filterOptions.frameworks.map((framework) => (
              <Checkbox key={framework} value={framework} className="w-full">
                {framework}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </AccordionItem>

        {/* Vertical Filter */}
        <AccordionItem
          key="vertical"
          aria-label="Industry"
          title={
            <div className="flex items-center justify-between w-full">
              <span>Industry</span>
              {selectedVerticals.length > 0 && (
                <Chip size="sm" variant="flat" color="default" className="ml-2">
                  {selectedVerticals.length}
                </Chip>
              )}
            </div>
          }
        >
          <CheckboxGroup
            value={selectedVerticals}
            onValueChange={setSelectedVerticals}
            size="sm"
          >
            {filterOptions.verticals.map((vertical) => (
              <Checkbox key={vertical} value={vertical} className="w-full">
                {vertical}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </AccordionItem>

      </Accordion>
    </div>
  );
}