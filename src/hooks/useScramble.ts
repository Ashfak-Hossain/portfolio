import type { RefObject } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

const CHARS = 'アイウエオカキクサシスソタチツヌネ01XZ#$%&▮▚／';

/**
 * Scrambles every `[data-scramble]` element inside `scope` into its own text,
 * staggered, using GSAP's ScrambleText plugin. No-op when `enabled` is false
 * (reduced motion) — the real text is already in the DOM, so it just stays.
 */
export function useScramble(scope: RefObject<HTMLElement | null>, enabled: boolean): void {
  useGSAP(
    () => {
      if (!enabled || !scope.current) return;
      const els = gsap.utils.toArray<HTMLElement>('[data-scramble]', scope.current);
      els.forEach((el, i) => {
        const text = el.textContent ?? '';
        gsap.to(el, {
          duration: 0.8,
          delay: i * 0.12,
          ease: 'none',
          scrambleText: { text, chars: CHARS, revealDelay: 0.25, speed: 0.5 },
        });
      });
    },
    { scope, dependencies: [enabled] },
  );
}
