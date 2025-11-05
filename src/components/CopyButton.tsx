'use client';

import { useState } from 'react';
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

interface CopyButtonProps {
  text: string;
  size?: 'small' | 'default';
}

export function CopyButton({ text, size = 'default' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const iconSize = size === 'small' ? 'w-3 h-3' : 'w-4 h-4';
  const buttonSize = size === 'small' ? 'p-1' : 'p-2';
  const fontSize = size === 'small' ? 'text-[10px]' : 'text-xs';

  return (
    <button
      onClick={handleCopy}
      className={`absolute top-2 right-2 ${buttonSize} bg-gray-800/80 hover:bg-gray-700 rounded transition-all duration-200 group z-10`}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        <div className="flex items-center gap-1">
          <CheckIcon className={`${iconSize} text-green-400`} />
          <span className={`${fontSize} text-green-400 whitespace-nowrap`}>Copied!</span>
        </div>
      ) : (
        <ClipboardDocumentIcon className={`${iconSize} text-gray-300 group-hover:text-white transition-colors`} />
      )}
    </button>
  );
}

