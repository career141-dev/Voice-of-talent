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
        src="https://media.career141.com/WhatsApp%20Video%202026-05-19%20at%203.05.38%20PM.mp4"
      />
    </div>
  );
}
