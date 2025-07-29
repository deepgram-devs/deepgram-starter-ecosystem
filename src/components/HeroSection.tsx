'use client';

import { motion } from 'framer-motion';
import { Button } from '@nextui-org/react';
import { ArrowDownIcon } from '@heroicons/react/24/outline';

export function HeroSection() {
  const scrollToGrid = () => {
    const gridSection = document.querySelector('.starter-grid-section');
    gridSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpIi8+Cjwvc3ZnPgo=')] opacity-20"></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Deepgram Quickstarts
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Discover and deploy modular starter applications. Build voice-powered demos with ease using our curated ecosystem.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Button
            size="lg"
            color="primary"
            variant="solid"
            className="text-lg px-8 py-6"
            onPress={scrollToGrid}
            endContent={<ArrowDownIcon className="w-5 h-5" />}
          >
            Explore Starters
          </Button>
          <Button
            size="lg"
            variant="bordered"
            className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-purple-900"
            as="a"
            href="https://github.com/deepgram-starters"
            target="_blank"
          >
            View on GitHub
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-200">20+</div>
            <div className="text-sm text-blue-100">Starter Apps</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-200">8+</div>
            <div className="text-sm text-blue-100">Languages</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-200">Fast</div>
            <div className="text-sm text-blue-100">Deployment</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-200">Open</div>
            <div className="text-sm text-blue-100">Source</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}