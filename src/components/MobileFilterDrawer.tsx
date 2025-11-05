'use client';

import {
  Button,
  Badge,
} from '@nextui-org/react';
import { FunnelIcon } from '@heroicons/react/24/outline';

interface MobileFilterDrawerProps {
  onOpen: () => void;
  activeFilterCount?: number;
}

export function MobileFilterDrawer({ onOpen, activeFilterCount = 0 }: MobileFilterDrawerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 lg:hidden">
      <Badge
        content={activeFilterCount}
        color="primary"
        isInvisible={activeFilterCount === 0}
        placement="top-right"
      >
        <Button
          isIconOnly
          color="default"
          variant="shadow"
          size="lg"
          className="w-14 h-14 btn-magenta-gradient shadow-2xl"
          onPress={onOpen}
          aria-label="Open filters"
        >
          <FunnelIcon className="w-6 h-6" />
        </Button>
      </Badge>
    </div>
  );
}

