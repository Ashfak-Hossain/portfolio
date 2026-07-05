import type { HTMLAttributes } from 'react';
import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { useMotion } from '../../hooks/useMotion';

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  /** Extra delay before the reveal, in seconds. */
  delay?: number;
  /** Vertical travel distance, in px. */
  y?: number;
}

/**
 * Fades + slides its content in the first time it scrolls into view. Under
 * reduced motion it renders instantly visible. Forwards className/style/etc.
 */
export function Reveal({ delay = 0, y = 30, children, style, ...rest }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reduced) {
        gsap.set(el, { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        },
      );
    },
    { scope: ref, dependencies: [reduced, delay, y] },
  );

  return (
    <div ref={ref} style={{ opacity: 0, ...style }} {...rest}>
      {children}
    </div>
  );
}
