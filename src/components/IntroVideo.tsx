'use client';

import { useRef, useEffect, useState } from 'react';

interface IntroVideoProps {
  onVideoEnd: (wasMuted: boolean) => void;
  onUserUnmute?: () => void;
}

export default function IntroVideo({ onVideoEnd, onUserUnmute }: IntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleEnded = () => {
      onVideoEnd(true);
    };

    videoElement.addEventListener('ended', handleEnded);

    return () => {
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, [onVideoEnd]);

  // Unmute on first user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      if (videoRef.current && !userInteracted) {
        videoRef.current.muted = false;
        setUserInteracted(true);
      }
    };

    const events = ['click', 'touchstart', 'keydown'];
    events.forEach((event) => {
      document.addEventListener(event, handleUserInteraction, { once: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [userInteracted]);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        preload="auto"
        className="w-full h-full object-cover"
        src="/videos/vot-intro.mp4"
      />
      {!userInteracted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white text-sm mb-4">Click anywhere to unmute</p>
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.muted = false;
                  setUserInteracted(true);
                  onUserUnmute?.();
                }
              }}
              className="px-6 py-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-sm transition"
            >
              🔊 Unmute
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
