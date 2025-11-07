'use client';

import { useState, useCallback, useImperativeHandle, forwardRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDisclosure } from "@nextui-org/react";
import { DocumentationIcon, ChangelogIcon } from "@/components/icons";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { MobileNav } from "@/components/MobileNav";
import logo from "../../public/deepgram.svg";

interface FilterState {
  language: string[];
  category: string[];
  framework: string[];
  tags: string[];
}

interface HeroSectionProps {
  onFiltersChange?: (filters: FilterState) => void;
}

export interface HeroSectionRef {
  openWithFilters: () => void;
}

export const HeroSection = forwardRef<HeroSectionRef, HeroSectionProps>(({ onFiltersChange }, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultOpen: false });
  const [shouldExpandFilters, setShouldExpandFilters] = useState(false);

  const handleHamburgerClick = useCallback(() => {
    setShouldExpandFilters(false);
    onOpen();
  }, [onOpen]);

  const handleFilterButtonClick = useCallback(() => {
    setShouldExpandFilters(true);
    onOpen();
  }, [onOpen]);

  const handleClose = useCallback(() => {
    setShouldExpandFilters(false);
    onClose();
  }, [onClose]);

  // Expose the filter button handler to parent via ref
  useImperativeHandle(ref, () => ({
    openWithFilters: handleFilterButtonClick
  }), [handleFilterButtonClick]);

  return (
    <>
      {/* Thin Header */}
      <div className="text-white pt-2 pb-1 sm:pb-4" style={{ backgroundColor: '#101014' }}>
        <header className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <Link className="flex" href="/">
              <Image
                className="h-auto w-[7rem] sm:max-w-none"
                src={logo}
                alt="Deepgram Logo"
                priority
              />
              <div className="inline-block mb-[0.3rem] ml-2 mt-2 relative">
                <h1 className="text-[1.4rem] text-white px-3 py-3 font-[var(--font-favorit)] relative lego-block" style={{ background: 'linear-gradient(to bottom, var(--magenta-start) 1%, var(--magenta-mid) 55%, var(--magenta-end) 88%)', border: '1px solid var(--magenta-end)' }}>
                  Starters
                </h1>
                {/* Left square stud */}
                <div className="lego-stud-base lego-stud-left"></div>
                {/* Center square stud */}
                <div className="lego-stud-base lego-stud-center"></div>
                {/* Right square stud */}
                <div className="lego-stud-base lego-stud-right"></div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 text-base font-semibold">
            <Link
              className="header-link leading-none"
              href="https://developers.deepgram.com/docs/introduction"
              target="_blank"
            >
              <DocumentationIcon className="mb-1 mr-1.5 text-lg" />
              <span className="inline-block p-1.5">Documentation</span>
            </Link>
            <Link
              className="header-link leading-none"
              href="https://playground.deepgram.com"
              target="_blank"
            >
              <ChangelogIcon className="mb-1 mr-1.5 text-lg" />
              <span className="inline-block p-1.5">Explore the API</span>
            </Link>
          </nav>

          {/* Mobile Hamburger Menu */}
          <button
            onClick={handleHamburgerClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Open menu"
          >
            <Bars3Icon className="w-7 h-7 text-white" />
          </button>
        </header>
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={isOpen}
        onClose={handleClose}
        onFiltersChange={onFiltersChange}
        autoExpandFilters={shouldExpandFilters}
      />
    </>
  );
});

HeroSection.displayName = 'HeroSection';