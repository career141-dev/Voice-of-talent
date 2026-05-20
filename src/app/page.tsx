'use client';

import { useState, useEffect, useRef } from 'react';
import IntroVideo from '@/components/IntroVideo';
import MainContent from '@/components/MainContent';
import { useIntroAnimation } from '@/hooks/useIntroAnimation';

const BACKGROUND_VIDEO_URL =
  'https://media.career141.com/YTDown_YouTube_Voices-of-Talent-Acquisition-Speaker-Bri_Media_P-jQdxD_D2U_001_1080p.mp4';

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [isUnmuted, setIsUnmuted] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { introRef, contentRef, handleVideoEnd } = useIntroAnimation({
    onIntroComplete: () => {
      setIntroComplete(true);
    },
  });

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.muted = !audioUnlocked;
    setIsUnmuted(!videoElement.muted);
  }, [audioUnlocked]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !introComplete) return;

    videoElement.currentTime = 0;
    videoElement.muted = !audioUnlocked;
    setIsUnmuted(!videoElement.muted);

    videoElement.play().catch((error) => {
      console.log('Background video play error:', error);
    });
  }, [audioUnlocked, introComplete]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch((error) => console.log('Play error:', error));
      } else {
        videoRef.current.pause();
      }
    }
  };

  const toggleVolume = () => {
    if (!videoRef.current) return;

    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsUnmuted(!nextMuted);

    if (!nextMuted) {
      setAudioUnlocked(true);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {introComplete && (
        <div className="fixed inset-0 z-40 h-screen w-screen overflow-hidden bg-black">
          <video
            ref={videoRef}
            className="h-full w-full cursor-pointer object-cover"
            autoPlay
            muted={!audioUnlocked}
            loop
            playsInline
            preload="auto"
            src={BACKGROUND_VIDEO_URL}
            onClick={togglePlayPause}
            onLoadedData={() => {
              videoRef.current?.play().catch((error) => {
                console.log('Background video loadedData error:', error);
              });
            }}
            onCanPlay={() => {
              videoRef.current?.play().catch((error) => {
                console.log('Background video canPlay error:', error);
              });
            }}
            onPlay={() => setVideoPlaying(true)}
            onPause={() => setVideoPlaying(false)}
            onError={(event) => {
              console.error('Video error:', event);
            }}
          />

          {!videoPlaying && (
          <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center bg-black/30">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/30">
              <svg className="ml-1 h-10 w-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>
          )}

          <button
            onClick={toggleVolume}
            className="fixed bottom-8 right-8 z-50 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/40"
            title="Toggle Volume"
          >
            {!isUnmuted ? (
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17a2 2 0 002 2h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.172a1 1 0 011.414 0A6.972 6.972 0 0119 10a6.972 6.972 0 01-2.929 5.828 1 1 0 01-1.414-1.414A4.972 4.972 0 0017 10a4.972 4.972 0 00-2.343-4.172 1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      )}

      {!introComplete && (
        <div ref={introRef} className="fixed inset-0 z-50 h-screen w-screen opacity-100">
          <IntroVideo
            onVideoEnd={handleVideoEnd}
            onUserUnmute={() => {
              setAudioUnlocked(true);
            }}
          />
        </div>
      )}

      <div ref={contentRef} className="fixed inset-0 z-10 hidden h-screen w-screen">
        <MainContent />
      </div>
    </div>
  );
}
