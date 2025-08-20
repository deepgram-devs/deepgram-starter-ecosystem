import { Spinner } from '@nextui-org/react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Spinner size="lg" style={{ color: 'var(--link-color)' }} />
        <p className="mt-4" style={{ color: 'var(--foreground)' }}>Loading starter apps...</p>
      </div>
    </div>
  );
}