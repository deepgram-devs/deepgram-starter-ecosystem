'use client';

import { useState, useEffect } from 'react';
import {
  Input,
  Select,
  SelectItem,
  Button,
  Chip,
  Card,
  CardBody
} from '@nextui-org/react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterOptions {
  languages: string[];
  categories: string[];
  frameworks: string[];
  verticals: string[];
  difficulties: string[];
  tags: string[];
}

interface FilterState {
  search: string;
  language: string[];
  category: string[];
  framework: string[];
  vertical: string[];
  difficulty: string[];
  tags: string[];
}

interface SearchFiltersProps {
  onFiltersChange?: (filters: FilterState) => void;
}

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [selectedVerticals, setSelectedVerticals] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Mock filter options - in real app, these would come from API
  const filterOptions: FilterOptions = {
    languages: ['JavaScript', 'Python', 'TypeScript', 'Go', 'Java', 'C#', 'PHP', 'Ruby'],
    categories: ['Voice Agent', 'Real-time', 'Batch Processing', 'Analytics', 'Streaming'],
    frameworks: ['Next.js', 'React', 'Express', 'FastAPI', 'Django', 'Vue.js', 'Svelte'],
    verticals: ['Drive-Thru', 'Call Center', 'Meeting Notes', 'Podcasts', 'Education'],
    difficulties: ['beginner', 'intermediate', 'advanced'],
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
      difficulty: selectedDifficulties,
      tags: selectedTags,
    };
    onFiltersChange?.(filters);
  }, [
    searchTerm,
    selectedLanguages,
    selectedCategories,
    selectedFrameworks,
    selectedVerticals,
    selectedDifficulties,
    selectedTags,
    onFiltersChange
  ]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedLanguages([]);
    setSelectedCategories([]);
    setSelectedFrameworks([]);
    setSelectedVerticals([]);
    setSelectedDifficulties([]);
    setSelectedTags([]);
  };

  const hasActiveFilters =
    searchTerm ||
    selectedLanguages.length ||
    selectedCategories.length ||
    selectedFrameworks.length ||
    selectedVerticals.length ||
    selectedDifficulties.length ||
    selectedTags.length;

  return (
    <Card className="w-full">
      <CardBody className="p-6">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input
            type="text"
            placeholder="Search starter apps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startContent={<MagnifyingGlassIcon className="w-5 h-5 text-default-400" />}
            className="flex-1"
            size="lg"
          />
          <Button
            variant={showAdvanced ? "solid" : "bordered"}
            startContent={<FunnelIcon className="w-5 h-5" />}
            onPress={() => setShowAdvanced(!showAdvanced)}
          >
            Filters
          </Button>
          {hasActiveFilters && (
            <Button
              variant="flat"
              color="danger"
              startContent={<XMarkIcon className="w-5 h-5" />}
              onPress={clearAllFilters}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-divider">
                {/* Language Filter */}
                <Select
                  label="Language"
                  placeholder="Select languages"
                  selectionMode="multiple"
                  selectedKeys={selectedLanguages}
                  onSelectionChange={(keys) => setSelectedLanguages(Array.from(keys as Set<string>))}
                  className="w-full"
                >
                  {filterOptions.languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </Select>

                {/* Category Filter */}
                <Select
                  label="Category"
                  placeholder="Select categories"
                  selectionMode="multiple"
                  selectedKeys={selectedCategories}
                  onSelectionChange={(keys) => setSelectedCategories(Array.from(keys as Set<string>))}
                  className="w-full"
                >
                  {filterOptions.categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </Select>

                {/* Framework Filter */}
                <Select
                  label="Framework"
                  placeholder="Select frameworks"
                  selectionMode="multiple"
                  selectedKeys={selectedFrameworks}
                  onSelectionChange={(keys) => setSelectedFrameworks(Array.from(keys as Set<string>))}
                  className="w-full"
                >
                  {filterOptions.frameworks.map((framework) => (
                    <SelectItem key={framework} value={framework}>
                      {framework}
                    </SelectItem>
                  ))}
                </Select>

                {/* Vertical Filter */}
                <Select
                  label="Use Case"
                  placeholder="Select use cases"
                  selectionMode="multiple"
                  selectedKeys={selectedVerticals}
                  onSelectionChange={(keys) => setSelectedVerticals(Array.from(keys as Set<string>))}
                  className="w-full"
                >
                  {filterOptions.verticals.map((vertical) => (
                    <SelectItem key={vertical} value={vertical}>
                      {vertical}
                    </SelectItem>
                  ))}
                </Select>

                {/* Difficulty Filter */}
                <Select
                  label="Difficulty"
                  placeholder="Select difficulty"
                  selectionMode="multiple"
                  selectedKeys={selectedDifficulties}
                  onSelectionChange={(keys) => setSelectedDifficulties(Array.from(keys as Set<string>))}
                  className="w-full"
                >
                  {filterOptions.difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4">
            {searchTerm && (
              <Chip
                variant="flat"
                onClose={() => setSearchTerm('')}
                startContent={<MagnifyingGlassIcon className="w-4 h-4" />}
              >
                &quot;{searchTerm}&quot;
              </Chip>
            )}
            {selectedLanguages.map((lang) => (
              <Chip
                key={lang}
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
                variant="flat"
                color="warning"
                onClose={() => setSelectedVerticals(prev => prev.filter(v => v !== vertical))}
              >
                {vertical}
              </Chip>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}