import { about, connect, poster, stats } from '../../content';
import { mangaChapters } from '../../content/mangaChapters';
import { Reveal } from '../ui/Reveal';
import styles from './About.module.css';

export function About() {
  const resume = connect.links.find((link) => link.label === 'RÉSUMÉ');

  return (
    <section id="about" className={styles.about} aria-labelledby="about-heading">
      <div className={styles.inner}>
        <div className={styles.chapter}>
          <span>{mangaChapters.about.chapter}</span>
          <span className={styles.chapterRule} />
          <span lang="ja">{mangaChapters.about.chapterJp}</span>
        </div>
        <div className={styles.grid}>
          <Reveal className={styles.collage} y={20}>
            <div className={styles.backSheet} aria-hidden="true" />
            <div className={styles.impact} aria-hidden="true">
              <span lang="ja">{mangaChapters.about.impactJp}</span>
              <span>{mangaChapters.about.impact}</span>
            </div>
            <span className={styles.tape} aria-hidden="true" />
            <figure className={styles.poster}>
              <div className={styles.posterTop}>
                <span>{mangaChapters.about.posterNumber}</span>
                <span>{poster.role}</span>
              </div>
              <div className={styles.wanted}>{mangaChapters.about.wanted}</div>
              <div className={styles.portrait}>
                {poster.portrait && (
                  <img src={poster.portrait} alt={mangaChapters.about.portraitAlt}
                    width="640" height="852" loading="lazy" decoding="async" />
                )}
                <span className={styles.portraitMark} aria-hidden="true" lang="ja">
                  {mangaChapters.about.portraitMark}
                </span>
              </div>
              <figcaption className={styles.caption}>
                <span className={styles.posterSub}>{mangaChapters.about.posterSub}</span>
                <strong>{poster.name}</strong>
                <span className={styles.bounty}><span aria-hidden="true">฿</span> {poster.bounty}</span>
                <span className={styles.posterFoot}>
                  <svg className={styles.pirateMark} viewBox="0 0 80 70" fill="none" aria-hidden="true">
                    <path d="m10 56 55-43M16 61 54 14M15 15l51 43M25 13l37 48" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    <path d="M22 26c0-12 8-19 18-19s18 7 18 19c0 9-4 14-10 17v10H32V43c-6-3-10-8-10-17Z" fill="var(--paper)" stroke="currentColor" strokeWidth="3" />
                    <path d="M21 21h38M29 16c0-9 22-9 22 0" stroke="currentColor" strokeWidth="4" />
                    <ellipse cx="33" cy="30" rx="5" ry="6" fill="currentColor" />
                    <ellipse cx="47" cy="30" rx="5" ry="6" fill="currentColor" />
                    <path d="m40 36-3 6h6l-3-6Zm-7 11h14m-10-4v9m6-9v9" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span>{mangaChapters.about.posterFoot}</span>
                </span>
              </figcaption>
            </figure>
            <div className={styles.note}>
              <span className={styles.noteStar} aria-hidden="true">✳</span>
              <span>{mangaChapters.about.note}</span>
              <svg className={styles.noteArrow} viewBox="0 0 80 60" fill="none" aria-hidden="true">
                <path d="M72 6C38 3 37 43 7 45m0 0 14-13M7 45l20 7" />
              </svg>
            </div>
          </Reveal>
          <Reveal className={styles.copy} y={20}>
            <span className={styles.eyebrow}>{mangaChapters.about.eyebrow}</span>
            <h2 id="about-heading" className={styles.heading}>
              {about.heading[0]}<span>{about.heading[1]}</span>
            </h2>
            <div className={styles.paragraphs}>
              {about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <blockquote className={styles.quote}>
              <p>{about.quote}</p>
            </blockquote>
            {resume?.href && (
              <a className={styles.resume} href={resume.href} target="_blank" rel="noreferrer">
                {mangaChapters.about.resume}<span aria-hidden="true">↗</span>
              </a>
            )}
          </Reveal>
        </div>
        <div className={styles.record}>
          <span className={styles.recordLabel}>{mangaChapters.about.record}</span>
          <dl className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value.toLocaleString()}<span>{stat.suffix}</span></dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
