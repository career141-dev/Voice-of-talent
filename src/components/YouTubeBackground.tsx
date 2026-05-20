'use client';

import { useEffect, useRef } from 'react';

interface YouTubeBackgroundProps {
  videoId: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function YouTubeBackground({ videoId }: YouTubeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const hasUnmuted = useRef(false);

  useEffect(() => {
    // Load YouTube API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      if (containerRef.current && !playerRef.current) {
        playerRef.current = new window.YT.Player(containerRef.current, {
          width: '100%',
          height: '100%',
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            loop: 1,
            playlist: videoId,
            fs: 0,
            iv_load_policy: 3,
            playsinline: 1,
          },
          events: {
            onReady: (event: any) => {
              event.target.playVideo();
              // Unmute after 2 seconds
              setTimeout(() => {
                if (!hasUnmuted.current) {
                  event.target.unMute();
                  hasUnmuted.current = true;
                }
              }, 2000);
            },
            onStateChange: (event: any) => {
              // Keep video playing
              if (event.data === window.YT.PlayerState.ENDED) {
                event.target.playVideo();
              }
            },
          },
        });
      }
    };

    // Trigger API ready if already loaded
    if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoId]);

  const toggleMute = () => {
    if (playerRef.current) {
      if (playerRef.current.isMuted()) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Audio Toggle Button */}
      <button
        onClick={toggleMute}
        className="fixed bottom-8 right-8 z-50 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition-all"
        title="Toggle Mute"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.172a1 1 0 011.414 0A6.972 6.972 0 0119 10a6.972 6.972 0 01-2.929 5.828 1 1 0 01-1.414-1.414A4.972 4.972 0 0017 10a4.972 4.972 0 00-2.343-4.172 1 1 0 010-1.414z" clipRule="evenodd" /><path fillRule="evenodd" d="M12.586 4.172a1 1 0 011.414 0A9.956 9.956 0 0121 10a9.956 9.956 0 01-6.828 9.172 1 1 0 11-.586-1.914A7.964 7.964 0 0019 10a7.964 7.964 0 00-5.414-7.414 1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
