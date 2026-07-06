import { useRef } from 'react';
import { skills, skillsHeading, skillsHeadingJp, skillsBlurb } from '../../content';
import { gsap, useGSAP } from '../../lib/gsap';
import { useMotion } from '../../hooks/useMotion';
import { KatanaBlade } from '../ui/KatanaBlade';
import styles from './Skills.module.css';

const COL_AURA: Record<string, string> = {
  white: styles.colWhite,
  cursed: styles.colCursed,
  haki: styles.colHaki,
};

// Impact sparkles thrown off the opening slash (% within the inner stage).
const SPARKS = [
  { l: 16, t: 30, s: 26 },
  { l: 82, t: 26, s: 20 },
  { l: 49, t: 16, s: 32 },
  { l: 33, t: 58, s: 18 },
  { l: 69, t: 62, s: 22 },
  { l: 91, t: 48, s: 15 },
];

// Ashura — a nine-sword ghost fan behind the centre.
const ASHURA_BLADES = Array.from({ length: 9 }, (_, i) => -60 + i * 15);

/**
 * 三刀流 (Santōryū) skills section — three named blades (Wadō / Kitetsu / Enma)
 * stand for three skill domains, drawn in on scroll (iai), punctuated by a
 * Conqueror's-haki crackle and an Ashura nine-blade ghost. Pure SVG/CSS/GSAP
 * (no WebGL) and fully reduced-motion aware.
 */
export function Skills() {
  const root = useRef<HTMLElement>(null);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      if (!root.current) return;
      const q = gsap.utils.selector(root.current);
      const blades = q('[data-blade-body]');
      const bodies = q('[data-colbody]');
      const chips = q('[data-chip]');
      const slash = q('[data-slash]');
      const sparks = q('[data-spark]');
      const haki = q('[data-haki]');
      const ashura = q('[data-ashura]');

      if (reduced) {
        gsap.set(blades, { scaleY: 1, opacity: 1 });
        gsap.set([...bodies, ...chips], { opacity: 1, y: 0, scale: 1 });
        gsap.set([...slash, ...sparks, ...haki], { opacity: 0 });
        gsap.set(ashura, { opacity: 0.05, scale: 1 });
        return;
      }

      gsap.set(blades, { scaleY: 0, opacity: 0, transformOrigin: 'center bottom' });
      gsap.set(bodies, { opacity: 0, y: 22 });
      gsap.set(chips, { opacity: 0, y: 10, scale: 0.9 });
      gsap.set(slash, { scaleX: 0, opacity: 1, transformOrigin: 'left center' });
      gsap.set(sparks, { scale: 0, opacity: 0, transformOrigin: 'center' });
      gsap.set(haki, { opacity: 0 });
      gsap.set(ashura, { opacity: 0, scale: 0.92, transformOrigin: 'center' });

      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 68%', once: true } })
        // 1 — the slash + its sparks
        .to(slash, { scaleX: 1, duration: 0.32, ease: 'power4.out' }, 0)
        .to(slash, { opacity: 0, duration: 0.4, ease: 'power2.out' }, 0.34)
        .to(
          sparks,
          { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(3)', stagger: 0.03 },
          0.16,
        )
        .to(sparks, { opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.52)
        // 2 — iai: the three blades draw up out of their guards
        .to(
          blades,
          { scaleY: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)', stagger: 0.12 },
          0.22,
        )
        // 3 — the text blocks + skill chips
        .to(bodies, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.1 }, 0.5)
        .to(
          chips,
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(2)', stagger: 0.04 },
          0.68,
        )
        // 4 — Conqueror's Haki crackle
        .to(
          haki,
          { opacity: 1, duration: 0.07, stagger: 0.05, repeat: 1, yoyo: true, ease: 'none' },
          0.92,
        )
        // 5 — Ashura nine-blade ghost shimmer, settling to a faint watermark
        .fromTo(
          ashura,
          { opacity: 0, scale: 0.92 },
          { opacity: 0.1, scale: 1, duration: 0.6, ease: 'power2.out' },
          0.88,
        )
        .to(ashura, { opacity: 0.05, duration: 1.1, ease: 'sine.inOut' }, 1.5);
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      id="skills"
      className={styles.section}
      aria-label={`${skillsHeading} — skills`}
    >
      {/* shared rough-ink filter for the blades */}
      <svg className={styles.defs} aria-hidden="true">
        <defs>
          <filter id="skillInk" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.045"
              numOctaves="2"
              seed="7"
              result="n"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="n"
              scale="2.2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* --- background art --- */}
      <div className={styles.halftone} aria-hidden="true" />
      <div className={styles.inkwash} aria-hidden="true" />
      <div className={styles.watermark} lang="ja" aria-hidden="true">
        {skillsHeadingJp}
      </div>

      {/* Ashura nine-blade ghost */}
      <svg className={styles.ashura} data-ashura viewBox="0 0 420 420" aria-hidden="true">
        <g
          transform="translate(210 236)"
          stroke="var(--ink)"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        >
          {ASHURA_BLADES.map((a) => (
            <line key={a} x1="0" y1="0" x2="0" y2="-190" transform={`rotate(${a})`} />
          ))}
        </g>
      </svg>

      {/* Conqueror's Haki crackle */}
      <svg
        className={styles.hakiField}
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polyline
          data-haki
          className={styles.bolt}
          points="0,120 220,70 340,150 560,60 720,160 940,80 1200,140"
        />
        <polyline
          data-haki
          className={styles.bolt}
          points="0,300 260,250 380,330 610,240 780,320 1010,250 1200,300"
        />
      </svg>

      <div className={styles.inner}>
        <header className={styles.head}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowRule} />
            <span lang="ja" className={styles.eyebrowJp}>
              {skillsHeadingJp}
            </span>
            <span className={styles.eyebrowEn}>{skillsHeading}</span>
          </div>
          <p className={styles.blurb}>{skillsBlurb}</p>
        </header>

        {/* opening slash + sparks */}
        <div className={styles.slash} data-slash aria-hidden="true" />
        <div className={styles.sparkField} aria-hidden="true">
          {SPARKS.map((s, i) => (
            <span
              key={i}
              data-spark
              className={styles.spark}
              style={{ left: `${s.l}%`, top: `${s.t}%`, width: s.s, height: s.s }}
            />
          ))}
        </div>

        <div className={styles.grid}>
          {skills.map((b) => (
            <article key={b.sword} className={`${styles.col} ${COL_AURA[b.aura]}`}>
              <div className={styles.bladeWrap}>
                <span className={styles.bladeKanji} lang="ja" aria-hidden="true">
                  {b.kanji}
                </span>
                <KatanaBlade aura={b.aura} />
              </div>
              <div className={styles.colBody} data-colbody>
                <div className={styles.sword}>
                  <span lang="ja" className={styles.swordJp}>
                    {b.swordJp}
                  </span>
                  <span className={styles.swordEn}>{b.sword}</span>
                </div>
                <h3 className={styles.domain}>{b.domain}</h3>
                <ul className={styles.chips}>
                  {b.tags.map((t) => (
                    <li key={t} data-chip className={styles.chip}>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
