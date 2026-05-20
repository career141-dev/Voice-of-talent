'use client';

import { ReactNode } from 'react';
import YouTubeBackground from './YouTubeBackground';

interface MainContentProps {
  children?: ReactNode;
  showYouTubeBackground?: boolean;
}

export default function MainContent({ children, showYouTubeBackground = false }: MainContentProps) {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-auto z-50">
      {showYouTubeBackground && (
        <div className="fixed inset-0 z-0">
          <YouTubeBackground videoId="dQw4w9WgXcQ" />
        </div>
      )}
      <div className="relative z-10 flex items-center justify-center min-h-screen bg-black/50">
        <div className="text-center px-6 py-12">
          {children}
        </div>
      </div>
    </div>
  );
}
