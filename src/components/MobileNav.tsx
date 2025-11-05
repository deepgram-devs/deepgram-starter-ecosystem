'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Link,
} from '@nextui-org/react';
import { DocumentationIcon, ChangelogIcon } from '@/components/icons';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      size="full"
      backdrop="blur"
      classNames={{
        base: "m-0 mobile-nav-modal",
        backdrop: "mobile-modal-backdrop",
        body: "p-6",
        header: "border-b border-gray-700",
        closeButton: "hidden",
      }}
      motionProps={{
        variants: {
          enter: {
            x: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            x: 100,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex justify-between items-center px-6 py-4">
              <h2 className="text-xl font-semibold">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                aria-label="Close menu"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </ModalHeader>
            <ModalBody>
              <nav className="flex flex-col gap-4">
                <Link
                  href="https://developers.deepgram.com/docs/introduction"
                  target="_blank"
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-800 transition-colors text-foreground"
                  onPress={onClose}
                >
                  <DocumentationIcon className="text-2xl" />
                  <div>
                    <div className="font-semibold text-lg">Documentation</div>
                    <div className="text-sm text-secondary">Learn about Deepgram APIs</div>
                  </div>
                </Link>

                <Link
                  href="https://playground.deepgram.com"
                  target="_blank"
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-800 transition-colors text-foreground"
                  onPress={onClose}
                >
                  <ChangelogIcon className="text-2xl" />
                  <div>
                    <div className="font-semibold text-lg">Explore the API</div>
                    <div className="text-sm text-secondary">Try the API Playground</div>
                  </div>
                </Link>
              </nav>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

