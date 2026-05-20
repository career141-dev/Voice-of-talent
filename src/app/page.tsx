'use client';

import { useState, useEffect, useRef } from 'react';
import IntroVideo from '@/components/IntroVideo';
import MainContent from '@/components/MainContent';
import { useIntroAnimation } from '@/hooks/useIntroAnimation';

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [isUnmuted, setIsUnmuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasUnmutedRef = useRef(false);

  const { introRef, contentRef, handleVideoEnd } = useIntroAnimation({
    onIntroComplete: () => {
      setIntroComplete(true);
    },
  });

  // Unmute video after intro completes (audio context is established)
  useEffect(() => {
    if (introComplete && videoRef.current && !hasUnmutedRef.current) {
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.muted = false;
          hasUnmutedRef.current = true;
          setIsUnmuted(true);
          console.log('✓ Video unmuted - audio context established');
        }
      }, 200);
    }
  }, [introComplete]);

  // Toggle play/pause on video click
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(e => console.log('Play error:', e));
      } else {
        videoRef.current.pause();
      }
    }
  };

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

      {/* Background Video - Fullscreen & Responsive */}
      {introComplete && (
        <div className="fixed inset-0 w-screen h-screen z-40 overflow-hidden bg-black">
          <video
            ref={videoRef}
            className="w-full h-full object-cover cursor-pointer"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onClick={togglePlayPause}
            onPlay={() => setVideoPlaying(true)}
            onPause={() => setVideoPlaying(false)}
            onError={(e) => {
              console.error('Video error:', e);
            }}
          >
            <source
              src="https://media.career141.com/YTDown_YouTube_Voices-of-Talent-Acquisition-Speaker-Bri_Media_P-jQdxD_D2U_001_1080p.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          {/* Play Button - Shows when paused */}
          {!videoPlaying && (
            <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 pointer-events-none">
              <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          )}
          
          {/* Volume Control Button - Bottom Right */}
          <button
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.muted = !videoRef.current.muted;
              }
            }}
            className="fixed bottom-8 right-8 z-50 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition-all"
            title="Toggle Volume"
          >
            {videoRef.current?.muted ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17a2 2 0 002 2h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.172a1 1 0 011.414 0A6.972 6.972 0 0119 10a6.972 6.972 0 01-2.929 5.828 1 1 0 01-1.414-1.414A4.972 4.972 0 0017 10a4.972 4.972 0 00-2.343-4.172 1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
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
