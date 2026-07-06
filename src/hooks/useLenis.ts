import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/gsap';

/**
 * Lenis smooth scrolling, driven off GSAP's ticker and kept in sync with
 * ScrollTrigger. Disabled entirely under reduced motion (native scroll).
 */
export function useLenis(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    // Build Lenis off the critical load path so its construction doesn't add to
    // main-thread blocking time during first paint. Smooth scroll isn't needed
    // in the first frame anyway.
    const start = () => {
      lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenis.on('scroll', ScrollTrigger.update);
      tick = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    };

    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (typeof requestIdleCallback === 'function') {
      idleId = requestIdleCallback(start, { timeout: 500 });
    } else {
      timeoutId = setTimeout(start, 1);
    }

    return () => {
      if (idleId !== undefined) cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, [enabled]);
}
