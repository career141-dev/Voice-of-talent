'use client';

import { useState, useEffect, useRef } from 'react';
import IntroVideo from '@/components/IntroVideo';
import MainContent from '@/components/MainContent';
import { useIntroAnimation } from '@/hooks/useIntroAnimation';

declare global {
  interface Window {
    YT: any;
  }
}

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { introRef, contentRef, handleVideoEnd } = useIntroAnimation({
    onIntroComplete: () => {
      setIntroComplete(true);
    },
  });

  useEffect(() => {
    if (introComplete) {
      // Load YouTube API when intro is complete
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }

      const initPlayer = () => {
        if (containerRef.current && !playerRef.current && window.YT && window.YT.Player) {
          playerRef.current = new window.YT.Player(containerRef.current, {
            width: '100%',
            height: '100%',
            videoId: 'P-jQdxD_D2U',
            playerVars: {
              autoplay: 1,
              mute: 1,
              controls: 0,
              modestbranding: 1,
              rel: 0,
              loop: 1,
              playlist: 'P-jQdxD_D2U',
              fs: 0,
              iv_load_policy: 3,
              playsinline: 1,
            },
            events: {
              onReady: (event: any) => {
                event.target.playVideo();
                // Auto-unmute after 3 seconds
                setTimeout(() => {
                  event.target.unMute();
                }, 3000);
              },
              onStateChange: (event: any) => {
                if (event.data === window.YT.PlayerState.ENDED) {
                  event.target.playVideo();
                }
              },
            },
          });
        }
      };

      if (window.YT && window.YT.Player) {
        initPlayer();
      } else {
        window.onYouTubeIframeAPIReady = initPlayer;
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [introComplete]);

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
            <div ref={containerRef} className="w-full h-full" />
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
