import React from 'react';
import {
  JavaScriptIcon,
  PythonIcon,
  GoIcon,
  JavaIcon,
  CSharpIcon,
  NodeJsIcon,
  NextJsIcon,
  RubyIcon,
  PhpIcon,
  DotNetIcon,
} from './index';

interface LanguageIconProps {
  language: string;
  className?: string;
}

/**
 * Maps programming language names to their respective icon components
 * and renders the appropriate icon based on the language string.
 *
 * @param {LanguageIconProps} props - The component props
 * @param {string} props.language - The programming language name
 * @param {string} [props.className] - Optional CSS classes to apply to the icon
 * @returns {React.ReactElement} The corresponding language icon component
 */
export const LanguageIcon: React.FC<LanguageIconProps> = ({ language, className }) => {
  const normalizedLanguage = language.toLowerCase().trim();

  // Map language strings to icon components
  const iconMap: Record<string, React.ReactElement> = {
    // JavaScript variants
    javascript: <JavaScriptIcon className={className} />,
    js: <JavaScriptIcon className={className} />,

    // TypeScript maps to JavaScript icon (common practice)
    typescript: <JavaScriptIcon className={className} />,
    ts: <JavaScriptIcon className={className} />,

    // Python
    python: <PythonIcon className={className} />,
    py: <PythonIcon className={className} />,

    // Go
    go: <GoIcon className={className} />,
    golang: <GoIcon className={className} />,

    // Java
    java: <JavaIcon className={className} />,

    // C#
    'c#': <CSharpIcon className={className} />,
    csharp: <CSharpIcon className={className} />,
    'c-sharp': <CSharpIcon className={className} />,

    // Node.js
    'node.js': <NodeJsIcon className={className} />,
    node: <NodeJsIcon className={className} />,
    nodejs: <NodeJsIcon className={className} />,

    // Next.js
    'next.js': <NextJsIcon className={className} />,
    nextjs: <NextJsIcon className={className} />,
    next: <NextJsIcon className={className} />,

    // Ruby
    ruby: <RubyIcon className={className} />,
    rb: <RubyIcon className={className} />,

    // PHP
    php: <PhpIcon className={className} />,

    // .NET
    '.net': <DotNetIcon className={className} />,
    dotnet: <DotNetIcon className={className} />,
    'c#.net': <DotNetIcon className={className} />,
  };

  // Return the matching icon or a default fallback
  const icon = iconMap[normalizedLanguage];

  if (icon) {
    return icon;
  }

  // Fallback: render a generic code icon with the language name
  return (
    <div className={`inline-flex items-center justify-center w-[1em] h-[1em] ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-full h-full"
      >
        <path d="M14.6 16.6L19.2 12L14.6 7.4L16 6L22 12L16 18L14.6 16.6ZM9.4 16.6L8 18L2 12L8 6L9.4 7.4L4.8 12L9.4 16.6Z" />
      </svg>
    </div>
  );
};

/**
 * Gets the background class for a language icon
 * Using a consistent magenta-purple gradient for all languages
 */
export const getLanguageIconBg = (): string => {
  // Return consistent magenta-purple gradient class for all languages
  return 'bg-magenta-purple';
};

/**
 * Gets the appropriate size class for a language icon
 * Some icons need to be larger to appear consistent due to different viewBox dimensions
 */
export const getLanguageIconSize = (language: string): string => {
  const normalizedLanguage = language.toLowerCase().trim();

  const sizeMap: Record<string, string> = {
    // Icons that appear smaller and need to be bigger
    go: 'w-14 h-14',
    golang: 'w-14 h-14',
    php: 'w-14 h-14',


    // Default size for most icons
  };

  return sizeMap[normalizedLanguage] || 'w-10 h-10';
};
