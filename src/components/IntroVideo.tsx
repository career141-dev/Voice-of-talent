'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

interface IntroVideoProps {
  onVideoEnd: (wasMuted: boolean) => void;
  onUserUnmute?: () => void;
}

const INTRO_VIDEO_URL =
  'https://media.career141.com/career141-intro.mp4.mp4';
const MOBILE_INTRO_VIDEO_URL = 'https://media.career141.com/mobile.mp4';

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
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={!userInteracted}
        preload="metadata"
        className="h-full w-full object-cover"
        onLoadedData={() => {
          if (videoRef.current && userInteracted) {
            videoRef.current.muted = false;
            videoRef.current.play().catch(() => {});
          }
        }}
        onError={() => {
          completeIntro();
        }}
      >
        <source src={MOBILE_INTRO_VIDEO_URL} media="(max-width: 767px)" type="video/mp4" />
        <source src={INTRO_VIDEO_URL} type="video/mp4" />
      </video>
    </div>
  );
}
