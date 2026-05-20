'use client';

import { useRef, useEffect } from 'react';

interface IntroVideoProps {
  onVideoEnd: () => void;
}

export default function IntroVideo({ onVideoEnd }: IntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleEnded = () => {
      onVideoEnd();
    };

    videoElement.addEventListener('ended', handleEnded);
    return () => {
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, [onVideoEnd]);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        src="/videos/intro.mp4"
      />
    </div>
  );
}
