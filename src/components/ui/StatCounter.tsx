import { useRef } from 'react';
import type { StatItem } from '../../types/content';
import { gsap, useGSAP } from '../../lib/gsap';
import { useMotion } from '../../hooks/useMotion';
import styles from './StatCounter.module.css';

/** A single stat cell whose number counts up when it scrolls into view. */
export function StatCounter({ value, suffix, label }: StatItem) {
  const numRef = useRef<HTMLSpanElement>(null);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      const el = numRef.current;
      if (!el) return;
      if (reduced) {
        el.textContent = value.toLocaleString();
        return;
      }
      const counter = { n: 0 };
      el.textContent = '0';
      gsap.to(counter, {
        n: value,
        duration: 1.3,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = Math.round(counter.n).toLocaleString();
        },
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    },
    { scope: numRef, dependencies: [reduced, value] },
  );

  return (
    <div className={styles.stat}>
      <div className={styles.value}>
        <span ref={numRef}>{value.toLocaleString()}</span>
        <span className={styles.suffix}>{suffix}</span>
      </div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
