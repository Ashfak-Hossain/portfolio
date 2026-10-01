import { useRef } from 'react';
import { about, stats } from '../../content';
import { gsap, useGSAP } from '../../lib/gsap';
import { useMotion } from '../../hooks/useMotion';
import { Reveal } from '../ui/Reveal';
import { Eyebrow } from '../ui/Eyebrow';
import { MangaPicture } from '../ui/MangaPicture';
import { StatCounter } from '../ui/StatCounter';
import { WantedPoster } from '../ui/WantedPoster';
import styles from './About.module.css';

/*
 * Speech-bubble outlines: the ellipse and its tail as ONE path, so the
 * outline runs unbroken around both (a CSS oval + a triangle always shows a
 * seam where they meet). Drawn in a 100×100 box that stretches to the
 * bubble; the tip sits outside the box. Each arc runs the long way round
 * (large-arc 1, sweep 1) from one tail root to the other.
 */
const TAIL_LEFT = 'M6.7 75 L-30 94 L0.8 58.7 A50 50 0 1 1 6.7 75 Z'; // toward a face on the left
const TAIL_UP = 'M25 6.7 L18 -34 L41.3 0.8 A50 50 0 1 1 25 6.7 Z'; // toward a face above

/**
 * About as a manga page laid on the ink-black desk: an establishing close-up
 * with the heading as narration (and its "Eventually." beat landing a moment
 * later), the story in narration boxes, and the quote spoken from a face
 * panel. Panels wipe in in reading order; the WANTED poster is pasted beside.
 */
export function About() {
  const root = useRef<HTMLElement>(null);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      if (!root.current) return;
      const q = gsap.utils.selector(root.current);
      const panels = q('[data-panel]');
      const sfx = q('[data-sfx]');
      const bubble = q('[data-bubble]');
      const beat = q('[data-beat]');

      if (reduced) {
        gsap.set(panels, { clipPath: 'inset(0% 0% 0% 0%)' });
        gsap.set([...sfx, ...bubble, ...beat], { opacity: 1, scale: 1 });
        return;
      }

      gsap.set(panels, { clipPath: 'inset(0% 100% 0% 0%)' });
      gsap.set([...sfx, ...bubble, ...beat], { opacity: 0, scale: 0.5 });

      gsap
        .timeline({ scrollTrigger: { trigger: q('[data-sheet]')[0], start: 'top 72%', once: true } })
        // panels ink in left → right, in reading order
        .to(panels, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.75,
          ease: 'power3.inOut',
          stagger: 0.28,
        })
        .to(sfx, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2.4)' }, 0.6)
        .to(bubble, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, 1.25)
        // the joke needs a pause before the punchline
        .to(beat, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(3)' }, 1.7);
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section ref={root} id="about" className={styles.about}>
      <div className={styles.halftone} aria-hidden="true" />

      <div className={styles.page}>
        <Reveal className={styles.eyebrowRow}>
          <Eyebrow tone="paper" num="一">
            About
          </Eyebrow>
        </Reveal>

        <div className={styles.sheet} data-sheet>
          {/* 1 — establishing close-up, heading as narration */}
          <div className={`${styles.panel} ${styles.splash}`} data-panel>
            <MangaPicture
              className={styles.art}
              art={about.splash.wide}
              narrow={about.splash.narrow}
              alt={about.splash.alt}
              sizes="(max-width: 1320px) 94vw, 1240px"
            />
            <h2 className={styles.heading}>
              <span className={styles.narration}>{about.heading[0]}</span>{' '}
              <span className={styles.beat} data-beat>
                {about.heading[1]}
              </span>
            </h2>
            <span className={styles.sfx} data-sfx lang="ja" aria-hidden="true">
              {about.splash.sfx}
            </span>
          </div>

          <div className={styles.story}>
            {/* 2 — the story, in narration boxes */}
            <div className={`${styles.panel} ${styles.textPanel}`} data-panel>
              {about.paragraphs.map((p, i) => (
                <p key={i} className={styles.caption}>
                  {p}
                </p>
              ))}
            </div>

            {/* 3 — the quote, spoken */}
            <div className={`${styles.panel} ${styles.speech}`} data-panel>
              <div className={styles.faceWrap}>
                <MangaPicture
                  className={styles.art}
                  art={about.face}
                  alt={about.face.alt}
                  sizes="(max-width: 700px) 92vw, 360px"
                />
              </div>
              <blockquote className={styles.bubble} data-bubble>
                <svg
                  className={styles.bubbleShape}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path className={styles.tailLeft} d={TAIL_LEFT} />
                  <path className={styles.tailUp} d={TAIL_UP} />
                </svg>
                <p className={styles.bubbleText}>{about.quote}</p>
              </blockquote>
            </div>
          </div>

          <div className={styles.posterCol}>
            <WantedPoster />
          </div>
        </div>
      </div>

      <Reveal className={styles.stats} delay={0.15}>
        {stats.map((s) => (
          <StatCounter key={s.label} {...s} />
        ))}
      </Reveal>
    </section>
  );
}
