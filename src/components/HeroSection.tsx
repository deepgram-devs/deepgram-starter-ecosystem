'use client';


export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white py-12">

      <div className="container mx-auto px-4 text-center">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Find your Quickstart
          </h1>
          <p className="text-lg md:text-xl mb-6 text-blue-100 max-w-3xl mx-auto">
            Jumpstart your app development process with pre-built solutions from Deepgram.
          </p>
        </div>

      </div>
    </section>
  );
}