'use client';

import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionItem,
  Checkbox,
  CheckboxGroup,
  Chip,
  Divider
} from '@nextui-org/react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';

interface FilterOptions {
  languages: string[];
  categories: string[];
  frameworks: string[];
  // verticals: string[]; // TODO: Re-enable when vertical data is available in deepgram.toml
  tags: string[];
}

interface FilterState {
  language: string[];
  category: string[];
  framework: string[];
  // vertical: string[]; // TODO: Re-enable when vertical data is available in deepgram.toml
  tags: string[];
}

interface FilterSidebarProps {
  onFiltersChange?: (filters: FilterState) => void;
  expandedKeys?: string[];
  hideTitle?: boolean;
}

export function FilterSidebar({ onFiltersChange, expandedKeys, hideTitle = false }: FilterSidebarProps) {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  // const [selectedVerticals, setSelectedVerticals] = useState<string[]>([]); // TODO: Re-enable when vertical data is available

  // Filter options based on actual TOML values from starter repositories
  const filterOptions: FilterOptions = {
    languages: ['C#', 'C++', 'Go', 'Java', 'JavaScript', 'PHP', 'Python', 'Ruby', 'Rust', 'TypeScript'],
    categories: ['Voice Agent', 'Live', 'STT', 'TTS'],
    frameworks: ['.NET', 'Django', 'Flask', 'Go', 'Next', 'Node', 'Sinatra'],
    // TODO: Re-enable when vertical data is available in deepgram.toml
    // verticals: [
    //   'Call Center & CX',
    //   'Healthcare',
    //   'Insurance & FinServ',
    //   'Food / Hospitality / Gyms',
    //   'Recruiting / HR',
    //   'Education',
    //   'Legal / Gov / Emergency',
    //   'Sales Enablement'
    // ],
    tags: ['real-time', 'websocket', 'streaming', 'api', 'webhook', 'ai', 'nlp']
  };

  // Update parent component when filters change
  useEffect(() => {
    const filters = {
      language: selectedLanguages,
      category: selectedCategories,
      framework: selectedFrameworks,
      // vertical: selectedVerticals, // TODO: Re-enable when vertical data is available
      tags: [],
    };
    onFiltersChange?.(filters);
  }, [
    selectedLanguages,
    selectedCategories,
    selectedFrameworks,
    // selectedVerticals, // TODO: Re-enable when vertical data is available
    onFiltersChange
  ]);

  const hasActiveFilters =
    selectedLanguages.length > 0 ||
    selectedCategories.length > 0 ||
    selectedFrameworks.length > 0;
  // || selectedVerticals.length > 0; // TODO: Re-enable when vertical data is available

  return (
    <div className="p-6 h-full">
      {/* Title */}
      {!hideTitle && (
        <div className="mb-6 flex items-center gap-2">
          <AdjustmentsHorizontalIcon className="w-5 h-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Filter Starters</h2>
        </div>
      )}



      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mb-6">
          <p className="text-sm font-medium text-foreground mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-1">
            {selectedLanguages.map((lang) => (
              <Chip
                key={lang}
                size="sm"
                variant="flat"
                style={{ backgroundColor: 'var(--link-color)', color: 'white' }}
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
                style={{ backgroundColor: 'var(--link-color)', color: 'white' }}
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
                style={{ backgroundColor: 'var(--link-color)', color: 'white' }}
                onClose={() => setSelectedFrameworks(prev => prev.filter(f => f !== framework))}
              >
                {framework}
              </Chip>
            ))}
            {/* TODO: Re-enable when vertical data is available in deepgram.toml */}
            {/* {selectedVerticals.map((vertical) => (
              <Chip
                key={vertical}
                size="sm"
                variant="flat"
                style={{ backgroundColor: 'var(--link-color)', color: 'white' }}
                onClose={() => setSelectedVerticals(prev => prev.filter(v => v !== vertical))}
              >
                {vertical}
              </Chip>
            ))} */}
          </div>
          <Divider className="mt-4" />
        </div>
      )}

      {/* Filter Accordion */}
      <Accordion
        variant="light"
        selectionMode="multiple"
        defaultExpandedKeys={
          expandedKeys !== undefined
            ? expandedKeys
            : [
              ...(selectedLanguages.length > 0 ? ["language"] : []),
              ...(selectedCategories.length > 0 ? ["category"] : []),
              ...(selectedFrameworks.length > 0 ? ["framework"] : [])
              // ...(selectedVerticals.length > 0 ? ["vertical"] : []) // TODO: Re-enable when vertical data is available
            ]
        }
      >
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
            classNames={{
              wrapper: "gap-0"
            }}
          >
            {filterOptions.languages.map((lang) => (
              <Checkbox
                key={lang}
                value={lang}
                className="w-full py-1"
                classNames={{
                  base: "flex flex-row-reverse justify-between items-center w-full max-w-full",
                  wrapper: "order-2",
                  label: `order-1 flex-1 text-sm ${selectedLanguages.includes(lang) ? 'text-selected-filter' : 'text-secondary'}`
                }}
              >
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
            classNames={{
              wrapper: "gap-0"
            }}
          >
            {filterOptions.categories.map((category) => (
              <Checkbox
                key={category}
                value={category}
                className="w-full py-1"
                classNames={{
                  base: "flex flex-row-reverse justify-between items-center w-full max-w-full",
                  wrapper: "order-2",
                  label: `order-1 flex-1 text-sm ${selectedCategories.includes(category) ? 'text-selected-filter' : 'text-secondary'}`
                }}
              >
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
            classNames={{
              wrapper: "gap-0"
            }}
          >
            {filterOptions.frameworks.map((framework) => (
              <Checkbox
                key={framework}
                value={framework}
                className="w-full py-1"
                classNames={{
                  base: "flex flex-row-reverse justify-between items-center w-full max-w-full",
                  wrapper: "order-2",
                  label: `order-1 flex-1 text-sm ${selectedFrameworks.includes(framework) ? 'text-selected-filter' : 'text-secondary'}`
                }}
              >
                {framework}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </AccordionItem>

        {/* TODO: Re-enable when vertical data is available in deepgram.toml */}
        {/* Vertical Filter */}
        {/* <AccordionItem
          key="vertical"
          aria-label="Vertical"
          title={
            <div className="flex items-center justify-between w-full">
              <span>Vertical</span>
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
            classNames={{
              wrapper: "gap-0"
            }}
          >
            {filterOptions.verticals.map((vertical) => (
              <Checkbox
                key={vertical}
                value={vertical}
                className="w-full py-1"
                classNames={{
                  base: "flex flex-row-reverse justify-between items-center w-full max-w-full",
                  wrapper: "order-2",
                  label: `order-1 flex-1 text-sm ${selectedVerticals.includes(vertical) ? 'text-selected-filter' : 'text-secondary'}`
                }}
              >
                {vertical}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </AccordionItem> */}

      </Accordion>
    </div>
  );
}