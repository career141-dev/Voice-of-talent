'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

interface IntroVideoProps {
  onVideoEnd: (wasMuted: boolean) => void;
  onUserUnmute?: () => void;
}

const INTRO_VIDEO_URL =
  'https://media.career141.com/WhatsApp%20Video%202026-05-19%20at%203.05.38%20PM.mp4';

export default function IntroVideo({ onVideoEnd, onUserUnmute }: IntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasCompletedRef = useRef(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const completeIntro = useCallback(() => {
    if (hasCompletedRef.current) return;

    hasCompletedRef.current = true;
    onVideoEnd(videoRef.current?.muted ?? true);
  }, [onVideoEnd]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleEnded = () => {
      completeIntro();
    };

    videoElement.addEventListener('ended', handleEnded);

    return () => {
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, [completeIntro]);

  useEffect(() => {
    const handleUserInteraction = () => {
      const videoElement = videoRef.current;

      setUserInteracted(true);

      if (videoElement) {
        videoElement.muted = false;
        videoElement.play().catch(() => {});
      }

      onUserUnmute?.();
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
  }, [onUserUnmute]);

  return (
    <div className="fixed inset-0 h-[100dvh] w-screen overflow-hidden bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={!userInteracted}
        preload="metadata"
        className="h-full w-full object-contain md:object-cover"
        src={INTRO_VIDEO_URL}
        onLoadedData={() => {
          if (videoRef.current && userInteracted) {
            videoRef.current.muted = false;
            videoRef.current.play().catch(() => {});
          }
        }}
        onError={() => {
          completeIntro();
        }}
      />
    </div>
  );
}
