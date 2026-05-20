'use client';

import { useState, useEffect, useRef } from 'react';
import IntroVideo from '@/components/IntroVideo';
import MainContent from '@/components/MainContent';
import { useIntroAnimation } from '@/hooks/useIntroAnimation';

declare global {
  interface Window {
    // YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiLoaded = false;
let playerInitQueue: (() => void)[] = [];

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerReadyRef = useRef(false);

  const { introRef, contentRef, handleVideoEnd } = useIntroAnimation({
    onIntroComplete: () => {
      setIntroComplete(true);
    },
  });

  // Load YouTube API once on mount
  useEffect(() => {
    if (youtubeApiLoaded) return;

    const globalCallback = () => {
      youtubeApiLoaded = true;
      // Process any queued initializations
      playerInitQueue.forEach(fn => fn());
      playerInitQueue = [];
    };

    window.onYouTubeIframeAPIReady = globalCallback;

    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      youtubeApiLoaded = true;
    } else {
      // Load the API script
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => {
        console.error('Failed to load YouTube API');
      };
      document.head.appendChild(script);
    }
  }, []);

  // Initialize player when intro completes
  useEffect(() => {
    if (introComplete && window.YT && window.YT.Player && containerRef.current && !playerRef.current) {
      playerRef.current = new window.YT.Player(containerRef.current, {
        width: '100%',
        height: '100%',
        videoId: 'P-jQdxD_D2U',
        playerVars: {
          autoplay: 1,
          mute: 1, // Start MUTED for autoplay to work on refresh
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
            playerReadyRef.current = true;
            event.target.playVideo();
            // Try to unmute if user has already interacted
            if (userHasInteracted) {
              try {
                event.target.unMute();
                event.target.setVolume(100);
              } catch (e) {
                console.log('Cannot unmute yet - waiting for user interaction');
              }
            }
          },
          onStateChange: (event: any) => {
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
  }, [introComplete, userHasInteracted]);

  // Handle user interaction to unmute video
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!userHasInteracted) {
        setUserHasInteracted(true);
        // Unmute player if ready
        if (playerRef.current && playerReadyRef.current) {
          try {
            playerRef.current.unMute();
            playerRef.current.setVolume(100);
          } catch (e) {
            console.log('Error unmuting:', e);
          }
        }
        // Remove listener after first interaction
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
      }
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [userHasInteracted]);

  useEffect(() => {
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
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-black">
      {/* Intro Video Container */}
      <div
        ref={introRef}
        className="fixed inset-0 w-screen h-screen z-50 opacity-100"
      >
        <IntroVideo 
          onVideoEnd={handleVideoEnd}
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
