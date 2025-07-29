import { Spinner } from '@nextui-org/react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-default-500">Loading starter apps...</p>
      </div>
    </div>
  );
}