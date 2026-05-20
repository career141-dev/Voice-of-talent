'use client';

import { useRef, useCallback } from 'react';
import gsap from 'gsap';

interface UseIntroAnimationProps {
  onIntroComplete: (wasMuted: boolean) => void;
}

export function useIntroAnimation({ onIntroComplete }: UseIntroAnimationProps) {
  const introRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleVideoEnd = useCallback((wasMuted: boolean) => {
    if (!introRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        if (introRef.current) {
          introRef.current.style.pointerEvents = 'none';
          introRef.current.style.visibility = 'hidden';
        }
        if (contentRef.current) {
          contentRef.current.classList.remove('hidden');
          gsap.to(contentRef.current, {
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
          });
        }
        onIntroComplete(wasMuted);
      },
    });

    tl.to(introRef.current, {
      opacity: 0,
      duration: 0.45,
      ease: 'power2.inOut',
    });
  }, [onIntroComplete]);

  return {
    introRef,
    contentRef,
    handleVideoEnd,
  };
}
