'use client';

import { useState, useEffect, useRef } from 'react';
import IntroVideo from '@/components/IntroVideo';
import MainContent from '@/components/MainContent';
import { useIntroAnimation } from '@/hooks/useIntroAnimation';

declare global {
  interface Window {
    // YT: any;
  }
}

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const [userHasUnmuted, setUserHasUnmuted] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { introRef, contentRef, handleVideoEnd } = useIntroAnimation({
    onIntroComplete: () => {
      setIntroComplete(true);
    },
  });

  useEffect(() => {
    if (introComplete) {
      // Set up callback BEFORE loading API
      const initPlayer = () => {
        if (containerRef.current && !playerRef.current && window.YT && window.YT.Player) {
          playerRef.current = new window.YT.Player(containerRef.current, {
            width: '100%',
            height: '100%',
            videoId: 'P-jQdxD_D2U',
            playerVars: {
              autoplay: 1,
              mute: 0, // Start unmuted if user already unmuted intro
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
                // Force play
                event.target.playVideo();
                event.target.setVolume(100);
              },
              onStateChange: (event: any) => {
                // Keep looping
                if (event.data === window.YT.PlayerState.ENDED) {
                  event.target.playVideo();
                }
              },
              onError: (event: any) => {
                console.error('YouTube error:', event.data);
              }
            },
          });
        }
      };

      // Set the callback globally
      window.onYouTubeIframeAPIReady = initPlayer;

      // Load API if not already loaded
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        document.head.appendChild(tag);
      } else if (window.YT && window.YT.Player) {
        // API already loaded, init immediately
        initPlayer();
      }
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.log('Error destroying player:', e);
        }
        playerRef.current = null;
      }
    };
  }, [introComplete, userHasUnmuted]);

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-black">
      {/* Intro Video Container */}
      <div
        ref={introRef}
        className="fixed inset-0 w-screen h-screen z-50 opacity-100"
      >
        <IntroVideo 
          onVideoEnd={handleVideoEnd}
          onUserUnmute={() => setUserHasUnmuted(true)}
        />
      </div>

      {/* YouTube Video - Fullscreen & Responsive */}
      {introComplete && (
        <div className="fixed inset-0 w-screen h-screen z-40 overflow-hidden bg-black flex items-center justify-center">
          <div className="relative w-full h-full">
            <div ref={containerRef} className="w-full h-full" />
            
            {/* Volume Control Button */}
            <button
              onClick={() => {
                if (playerRef.current) {
                  if (playerRef.current.isMuted()) {
                    playerRef.current.unMute();
                    playerRef.current.setVolume(100);
                  } else {
                    playerRef.current.mute();
                  }
                }
              }}
              className="fixed bottom-8 right-8 z-50 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition-all"
              title="Toggle Volume"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.172a1 1 0 011.414 0A6.972 6.972 0 0119 10a6.972 6.972 0 01-2.929 5.828 1 1 0 01-1.414-1.414A4.972 4.972 0 0017 10a4.972 4.972 0 00-2.343-4.172 1 1 0 010-1.414z" clipRule="evenodd" /><path fillRule="evenodd" d="M12.586 4.172a1 1 0 011.414 0A9.956 9.956 0 0121 10a9.956 9.956 0 01-6.828 9.172 1 1 0 11-.586-1.914A7.964 7.964 0 0019 10a7.964 7.964 0 00-5.414-7.414 1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
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
