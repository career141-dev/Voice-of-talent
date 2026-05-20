'use client';

import { useState } from 'react';
import IntroVideo from '@/components/IntroVideo';
import MainContent from '@/components/MainContent';
import { useIntroAnimation } from '@/hooks/useIntroAnimation';

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);

  const { introRef, contentRef, handleVideoEnd } = useIntroAnimation({
    onIntroComplete: () => setIntroComplete(true),
  });

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-black">
      {/* Intro Video Container */}
      <div
        ref={introRef}
        className="fixed inset-0 w-screen h-screen z-50 opacity-100"
      >
        <IntroVideo onVideoEnd={handleVideoEnd} />
      </div>

      {/* YouTube Video - Fullscreen & Responsive */}
      {introComplete && (
        <div className="fixed inset-0 w-screen h-screen z-40 overflow-hidden bg-black flex items-center justify-center">
          <div className="relative w-full h-full">
            <iframe
              src="https://www.youtube.com/embed/P-jQdxD_D2U?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0&loop=1&playlist=P-jQdxD_D2U&fs=0&vq=hd720"
              title="Background Video"
              allow="autoplay;encrypted-media"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block',
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content - Hidden */}
      <div
        ref={contentRef}
        className="fixed inset-0 w-screen h-screen z-10 hidden"
      >
        <MainContent />
      </div>
    </div>
  );
}
