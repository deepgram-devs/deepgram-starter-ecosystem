'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const getIcon = () => {
    if (theme === 'light') return <SunIcon className="w-5 h-5" />;
    if (theme === 'dark') return <MoonIcon className="w-5 h-5" />;
    return <ComputerDesktopIcon className="w-5 h-5" />;
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="light"
          aria-label="Select theme"
          style={{ color: 'var(--header-link)' }}
          className="hover:!text-[var(--header-link-hover)] transition-colors"
        >
          {getIcon()}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Theme selection"
        selectedKeys={[theme || 'system']}
        onAction={(key) => setTheme(key as string)}
        style={{ backgroundColor: 'var(--theme-dropdown-bg)', borderRadius: 'var(--dropdown-radius)' }}
      >
        <DropdownItem
          key="light"
          startContent={<SunIcon className="w-4 h-4" />}
          endContent={theme === 'light' ? <CheckIcon className="w-4 h-4" /> : null}
        >
          Light
        </DropdownItem>
        <DropdownItem
          key="dark"
          startContent={<MoonIcon className="w-4 h-4" />}
          endContent={theme === 'dark' ? <CheckIcon className="w-4 h-4" /> : null}
        >
          Dark
        </DropdownItem>
        <DropdownItem
          key="system"
          startContent={<ComputerDesktopIcon className="w-4 h-4" />}
          endContent={theme === 'system' ? <CheckIcon className="w-4 h-4" /> : null}
        >
          System
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

