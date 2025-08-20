'use client';

import { useState, useEffect } from 'react';
import { Input } from '@nextui-org/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  onSearchChange?: (searchTerm: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  onSearchChange,
  placeholder = "Search starters...",
  className = ""
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Notify parent component when search term changes
  useEffect(() => {
    onSearchChange?.(searchTerm);
  }, [searchTerm, onSearchChange]);

  return (
    <div className={`mb-6 ${className}`}>
      <div className="bg-default-100 rounded-lg p-2 w-full" style={{ border: '1px solid var(--border-color)' }}>
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startContent={
            <div className="flex items-center justify-center">
              <MagnifyingGlassIcon className="w-4 h-4 text-default-400" />
            </div>
          }
          variant="flat"
          size="md"
          classNames={{
            inputWrapper: "bg-transparent border-none shadow-none flex items-center",
            input: "text-left"
          }}
        />
      </div>
    </div>
  );
}
