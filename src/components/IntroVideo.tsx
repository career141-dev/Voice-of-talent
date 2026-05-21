'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

interface IntroVideoProps {
  onVideoEnd: (wasMuted: boolean) => void;
  onUserUnmute?: () => void;
}

const INTRO_VIDEO_URL =
  'https://media.career141.com/career141-intro.mp4.mp4';
const MOBILE_INTRO_VIDEO_URL = 'https://media.career141.com/Vot%20Web%20Upload%20Recf.mp4';
const MOBILE_INTRO_QUERY = '(max-width: 767px)';

export default function IntroVideo({ onVideoEnd, onUserUnmute }: IntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasCompletedRef = useRef(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [introVideoUrl, setIntroVideoUrl] = useState<string | null>(null);

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
  }, [completeIntro, introVideoUrl]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_INTRO_QUERY);

    const handleMediaChange = (event: MediaQueryListEvent) => {
      setIntroVideoUrl(event.matches ? MOBILE_INTRO_VIDEO_URL : INTRO_VIDEO_URL);
    };

    setIntroVideoUrl(mediaQuery.matches ? MOBILE_INTRO_VIDEO_URL : INTRO_VIDEO_URL);
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || hasCompletedRef.current) return;

    videoElement.load();
    videoElement.play().catch(() => {});
  }, [introVideoUrl]);

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
    <div className="fixed inset-0 h-[100svh] min-h-[100dvh] w-screen overflow-hidden bg-black md:h-screen">
      {introVideoUrl && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={!userInteracted}
          preload="metadata"
          src={introVideoUrl}
          className="block h-full w-full object-cover object-center"
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
      )}
    </div>
  );
}
