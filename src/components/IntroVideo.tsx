'use client';

import { useRef, useEffect, useState } from 'react';

interface IntroVideoProps {
  onVideoEnd: () => void;
}

export default function IntroVideo({ onVideoEnd }: IntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleEnded = () => {
      onVideoEnd();
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('canplay', handleCanPlay);
    return () => {
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('canplay', handleCanPlay);
    };
  }, [onVideoEnd]);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-gray-400 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
        src="https://media.career141.com/WhatsApp%20Video%202026-05-19%20at%203.05.38%20PM.mp4"
      />
    </div>
  );
}
