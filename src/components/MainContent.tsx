'use client';

import { ReactNode } from 'react';
import YouTubeBackground from './YouTubeBackground';

interface MainContentProps {
  children?: ReactNode;
  showYouTubeBackground?: boolean;
}

export default function MainContent({ children, showYouTubeBackground = false }: MainContentProps) {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-auto opacity-0 z-50 bg-black">
      {showYouTubeBackground && (
        <div className="fixed inset-0 z-0">
          <YouTubeBackground videoId="dQw4w9WgXcQ" />
        </div>
      )}
      <div className="relative z-10 flex items-center justify-center min-h-screen bg-black/50">
        <div className="text-center px-6 py-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl">
            Experience premium cinematic design with seamless transitions and immersive visuals.
          </p>
          <button className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors">
            Explore More
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}
