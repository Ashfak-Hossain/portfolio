import { useRef } from 'react';
import { stamp } from '../../content';
import { gsap, useGSAP } from '../../lib/gsap';
import { useMotion } from '../../hooks/useMotion';
import styles from './InkImpact.module.css';

// Impact sparkles scattered around the title drop (% within the stage).
const STARS = [
  { l: 13, t: 22, s: 30, red: true },
  { l: 87, t: 18, s: 22, red: false },
  { l: 7, t: 72, s: 24, red: false },
  { l: 91, t: 74, s: 32, red: true },
  { l: 48, t: 6, s: 18, red: false },
  { l: 72, t: 90, s: 22, red: true },
];

/**
 * Manga impact panel — the motif word 証明 slams in as a title-drop over
 * static horizontal action-lines (流線) + screentone, with a red offset shadow,
 * 「!!」, impact sparkles and a screen shake. (No rotating radial motif — that
 * lives only in the hero.)
 */
export function InkImpact() {
  const root = useRef<HTMLElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const halftoneRef = useRef<HTMLDivElement>(null);
  const impactRef = useRef<HTMLDivElement>(null);
  const glossRef = useRef<HTMLDivElement>(null);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      if (!root.current) return;
      const lines = linesRef.current;
      const halftone = halftoneRef.current;
      const impact = impactRef.current;
      const gloss = glossRef.current;
      if (!lines || !halftone || !impact || !gloss) return;
      const stars = gsap.utils.toArray<HTMLElement>('[data-star]', root.current);

      if (reduced) {
        gsap.set(lines, { scaleX: 1, opacity: 1 });
        gsap.set(halftone, { opacity: 0.07 });
        gsap.set(impact, { scale: 1, opacity: 1, rotate: -4 });
        gsap.set(stars, { scale: 1, opacity: 1 });
        gsap.set(gloss, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(lines, { scaleX: 1.12, opacity: 0 });
      gsap.set(halftone, { opacity: 0 });
      gsap.set(impact, { scale: 1.5, opacity: 0, rotate: -10 });
      gsap.set(stars, { scale: 0, opacity: 0, transformOrigin: 'center' });
      gsap.set(gloss, { opacity: 0, y: 8 });

      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 72%', once: true } })
        .to(lines, { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0)
        .to(halftone, { opacity: 0.07, duration: 0.4 }, 0.1)
        .to(
          impact,
          { scale: 1, opacity: 1, rotate: -4, duration: 0.5, ease: 'back.out(2.2)' },
          0.12,
        )
        .to(
          impact,
          {
            keyframes: { x: [0, -9, 8, -6, 4, 0], y: [0, 6, -7, 4, -2, 0] },
            duration: 0.4,
            ease: 'power1.inOut',
          },
          0.55,
        )
        .to(stars, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(3)', stagger: 0.04 }, 0.5)
        .to(gloss, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.72);
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      id="proof"
      className={styles.section}
      aria-label={`${stamp.romaji} — ${stamp.meaning}`}
    >
      <div ref={linesRef} className={styles.actionLines} aria-hidden="true" />
      <div ref={halftoneRef} className={styles.halftone} aria-hidden="true" />

      <div className={styles.stage}>
        {STARS.map((star, i) => (
          <span
            key={i}
            data-star
            className={`${styles.star} ${star.red ? styles.starRed : styles.starInk}`}
            style={{ left: `${star.l}%`, top: `${star.t}%`, width: star.s, height: star.s }}
          />
        ))}

        <div ref={impactRef} className={styles.impact} lang="ja" aria-hidden="true">
          <span className={styles.word}>{stamp.kanji}</span>
          <span className={styles.bangs}>!!</span>
        </div>
      </div>

      <div ref={glossRef} className={styles.gloss} aria-hidden="true">
        {stamp.gloss.split('').join(' · ')}
        <span className={styles.glossMeaning}>
          {stamp.romaji} — “{stamp.meaning}”
        </span>
      </div>
    </section>
  );
}
