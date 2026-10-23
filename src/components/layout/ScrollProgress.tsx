import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { useMotion } from '../../hooks/useMotion';
import styles from './ScrollProgress.module.css';

/** Thin top progress bar scaled to page scroll via ScrollTrigger scrub. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      if (reduced) {
        gsap.set(ref.current, { scaleX: 0 });
        return;
      }
      gsap.to(ref.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.2 },
      });
    },
    { scope: ref, dependencies: [reduced], revertOnUpdate: true },
  );

  return <div ref={ref} className={styles.bar} aria-hidden="true" />;
}
