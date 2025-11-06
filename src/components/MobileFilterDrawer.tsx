'use client';

import {
  Button,
  Badge,
} from '@nextui-org/react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';

interface MobileFilterDrawerProps {
  onOpen: () => void;
  activeFilterCount?: number;
}

export function MobileFilterDrawer({ onOpen, activeFilterCount = 0 }: MobileFilterDrawerProps) {
  // Only show the filter button when there are active filters
  if (activeFilterCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 lg:hidden">
      <Badge
        content={activeFilterCount}
        color="primary"
        placement="top-right"
      >
        <Button
          isIconOnly
          color="default"
          variant="shadow"
          size="lg"
          className="w-14 h-14 btn-magenta-gradient shadow-2xl"
          onPress={onOpen}
          aria-label="Clear all filters"
        >
          <AdjustmentsHorizontalIcon className="w-6 h-6" />
        </Button>
      </Badge>
    </div>
  );
}

