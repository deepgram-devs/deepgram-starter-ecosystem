'use client';

import Image from "next/image";
import Link from "next/link";
import { DocumentationIcon, ChangelogIcon } from "@/components/icons";
import logo from "../../public/deepgram.svg";

export function HeroSection() {
  return (
    <>
      {/* Thin Header */}
      <div className="bg-black text-white pt-2 pb-1 sm:pb-4">
        <header className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 flex justify-between">
          <div>
            <a className="flex" href="/">
              <Image
                className="h-auto w-[7rem] sm:max-w-none"
                src={logo}
                alt="Deepgram Logo"
                priority
              />
              <div className="inline-block mb-[0.3rem] ml-2 mt-2 relative">
                <h1 className="text-[1.4rem] text-white bg-gradient-to-b from-purple-500 via-purple-600 to-purple-800 px-3 py-3 font-[var(--font-favorit)] relative border border-purple-600 lego-block">
                  Starters
                </h1>
                {/* Left square stud */}
                <div className="lego-stud-base lego-stud-left"></div>
                {/* Center square stud */}
                <div className="lego-stud-base lego-stud-center"></div>
                {/* Right square stud */}
                <div className="lego-stud-base lego-stud-right"></div>
              </div>
            </a>
          </div>
          <nav className="hidden md:flex items-center gap-4 text-base font-semibold">
            <Link
              className="transition-all hover:text-gray-300 leading-none"
              href="https://developers.deepgram.com/docs/introduction"
              target="_blank"
            >
              <DocumentationIcon className="mb-1 mr-1.5 text-lg" />
              <span className="inline-block p-1.5">Documentation</span>
            </Link>
            <Link
              className="transition-all hover:text-gray-300 leading-none"
              href="https://playground.deepgram.com"
              target="_blank"
            >
              <ChangelogIcon className="mb-1 mr-1.5 text-lg" />
              <span className="inline-block p-1.5">Explore the API</span>
            </Link>
          </nav>
        </header>
      </div>

    </>
  );
}