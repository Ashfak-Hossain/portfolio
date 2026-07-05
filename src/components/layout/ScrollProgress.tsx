import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import styles from './ScrollProgress.module.css';

/** Thin top progress bar scaled to page scroll via ScrollTrigger scrub. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(ref.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.2 },
      });
    },
    { scope: ref },
  );

  return <div ref={ref} className={styles.bar} aria-hidden="true" />;
}
