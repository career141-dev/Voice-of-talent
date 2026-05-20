'use client';

import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';

interface UseIntroAnimationProps {
  onIntroComplete: () => void;
}

export function useIntroAnimation({ onIntroComplete }: UseIntroAnimationProps) {
  const introRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleVideoEnd = useCallback(() => {
    if (!introRef.current || !contentRef.current) return;

    // Create a timeline for synchronized animations
    const tl = gsap.timeline({
      onComplete: () => {
        // Hide intro after animation completes
        if (introRef.current) {
          introRef.current.style.pointerEvents = 'none';
          introRef.current.style.zIndex = '-1';
        }
        onIntroComplete();
      },
    });

    // Fade out intro video and fade in main content simultaneously
    tl.to(
      introRef.current,
      {
        opacity: 0,
        duration: 1.5,
        ease: 'power2.inOut',
      },
      0 // Start at time 0
    ).to(
      contentRef.current,
      {
        opacity: 1,
        duration: 1.5,
        ease: 'power2.inOut',
      },
      0 // Start at same time for parallel animation
    );
  }, [onIntroComplete]);

  return {
    introRef,
    contentRef,
    handleVideoEnd,
  };
}
