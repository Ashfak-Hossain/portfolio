import { about, stats } from '../../content';
import { Reveal } from '../ui/Reveal';
import { Eyebrow } from '../ui/Eyebrow';
import { StatCounter } from '../ui/StatCounter';
import { WantedPoster } from '../ui/WantedPoster';
import styles from './About.module.css';

export function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.halftone} />

      <div className={styles.grid}>
        <Reveal className={styles.copy}>
          <Eyebrow tone="paper">01 — About</Eyebrow>
          <h2 className={styles.heading}>
            {about.heading[0]}
            <br />
            {about.heading[1]}
          </h2>
          {about.paragraphs.map((p, i) => (
            <p key={i} className={styles.para}>
              {p}
            </p>
          ))}
          <blockquote className={styles.quote}>&ldquo;{about.quote}&rdquo;</blockquote>
        </Reveal>

        <WantedPoster />
      </div>

      <Reveal className={styles.stats} delay={0.15}>
        {stats.map((s) => (
          <StatCounter key={s.label} {...s} />
        ))}
      </Reveal>
    </section>
  );
}
