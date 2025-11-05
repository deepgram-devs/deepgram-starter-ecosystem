'use client';

import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Badge,
} from '@nextui-org/react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FilterSidebar } from '@/components/FilterSidebar';

interface FilterState {
  language: string[];
  category: string[];
  framework: string[];
  tags: string[];
}

interface MobileFilterDrawerProps {
  onFiltersChange?: (filters: FilterState) => void;
  activeFilterCount?: number;
}

export function MobileFilterDrawer({ onFiltersChange, activeFilterCount = 0 }: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Floating Filter Button - Fixed position bottom right */}
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
            onPress={handleOpen}
            aria-label="Open filters"
          >
            <FunnelIcon className="w-6 h-6" />
          </Button>
        </Badge>
      </div>

      {/* Filter Drawer Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size="full"
        placement="bottom"
        backdrop="blur"
        classNames={{
          base: "m-0 sm:m-0 mobile-filter-modal",
          backdrop: "mobile-modal-backdrop",
          body: "p-0",
          header: "border-b border-gray-700",
          closeButton: "hidden",
        }}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: 50,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
        style={{ backgroundColor: 'var(--background)' }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex justify-between items-center px-6 py-4" style={{ backgroundColor: 'var(--panel)' }}>
                <h2 className="text-xl font-semibold text-foreground">Filters</h2>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={handleClose}
                  aria-label="Close filters"
                >
                  <XMarkIcon className="w-6 h-6" />
                </Button>
              </ModalHeader>
              <ModalBody className="overflow-y-auto max-h-[80vh]" style={{ backgroundColor: 'var(--panel)' }}>
                <FilterSidebar onFiltersChange={onFiltersChange} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

