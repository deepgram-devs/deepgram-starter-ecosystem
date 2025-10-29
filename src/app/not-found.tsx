'use client';

import { Card, CardBody, Button, Link } from '@nextui-org/react';
import { HomeIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <div className="p-1 border-magenta-purple rounded-lg">
          <Card className="bg-black border-none">
            <CardBody className="text-center p-8">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🔍</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">404</h1>
                <h2 className="text-xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
                <p className="text-gray-400 leading-relaxed">
                  The page you&apos;re looking for doesn&apos;t exist or has been moved.
                  Let&apos;s get you back to exploring starter projects.
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  as={Link}
                  href="/"
                  startContent={<HomeIcon className="w-4 h-4" />}
                  className="min-w-32 btn-magenta-gradient"
                >
                  Home
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </Card>
    </div>
  );
}