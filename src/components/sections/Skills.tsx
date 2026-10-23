import { useRef } from 'react';
import { skills, skillsBlurb, skillsHeadingJp } from '../../content';
import { mangaChapters } from '../../content/mangaChapters';
import { gsap, useGSAP } from '../../lib/gsap';
import { useMotion } from '../../hooks/useMotion';
import { KatanaBlade } from '../ui/KatanaBlade';
import styles from './Skills.module.css';

export function Skills() {
  const root = useRef<HTMLElement>(null);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      if (!root.current) return;
      const select = gsap.utils.selector(root.current);
      const panels = select('[data-armory-panel]');
      const blades = select('[data-blade-body]');
      const slash = select('[data-armory-slash]');

      if (reduced) {
        gsap.set(panels, { opacity: 1, y: 0 });
        gsap.set(blades, { scaleY: 1 });
        gsap.set(slash, { scaleX: 1 });
        return;
      }

      gsap.fromTo(slash, { scaleX: 0 }, {
        scaleX: 1, duration: 0.65, ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
      });
      panels.forEach((panel, index) => {
        gsap.fromTo(panel, { y: 22, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.55, delay: index * 0.09, ease: 'power3.out',
          scrollTrigger: { trigger: panel, start: 'top 92%', once: true },
        });
      });
      blades.forEach((blade, index) => {
        gsap.fromTo(blade, { scaleY: 0.72 }, {
          scaleY: 1, duration: 0.7, delay: index * 0.09, ease: 'power3.out',
          scrollTrigger: { trigger: blade, start: 'top 90%', once: true },
        });
      });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="skills" className={styles.section} aria-labelledby="skills-heading">
      <svg className={styles.defs} aria-hidden="true">
        <defs>
          <filter id="skillInk" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <div className={styles.inner}>
        <div className={styles.chapter}>
          <span>{mangaChapters.skills.chapter}</span>
          <span className={styles.chapterRule} />
          <span lang="ja">{skillsHeadingJp}</span>
        </div>
        <header className={styles.head}>
          <div>
            <span className={styles.eyebrow}>{mangaChapters.skills.eyebrow}</span>
            <h2 id="skills-heading" className={styles.heading}>
              {mangaChapters.skills.title[0]}
              <span>{mangaChapters.skills.title[1]}</span>
            </h2>
          </div>
          <div className={styles.intro}>
            <span className={styles.seal} aria-hidden="true" lang="ja">{skillsHeadingJp}</span>
            <p>{skillsBlurb}</p>
          </div>
        </header>
        <div className={styles.slash} data-armory-slash aria-hidden="true" />
        <div className={styles.grid}>
          {skills.map((blade, index) => (
            <article key={blade.sword} className={styles.col} data-armory-panel>
              <div className={styles.exhibit}>
                <div className={styles.speedLines} aria-hidden="true" />
                <svg className={styles.auraArt} viewBox="0 0 300 340" preserveAspectRatio="none" aria-hidden="true">
                  <path d="m80 329 22-50-14-19 32-27-9-22 27-36-6-29 25-34-10-19 32-31-8-28 23-27M182 324l-7-39 24-29-8-22 21-38-10-24 24-29-4-27 20-27-9-25" />
                  <path d="m59 264 21-19-12-19 27-38M204 107l24-26-9-18 23-24" />
                </svg>
                <span className={styles.inventory}>{String(index + 1).padStart(2, '0')} / 03</span>
                <span className={styles.exhibitJp} lang="ja">{blade.swordJp}</span>
                <span className={styles.kanji} lang="ja" aria-hidden="true">{blade.kanji}</span>
                <div className={`${styles.bladeWrap} ${styles[blade.aura]}`}>
                  <KatanaBlade aura={blade.aura} />
                </div>
                <span className={styles.sword}>{blade.sword}</span>
                <span className={styles.exhibitIndex} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.soundEffect} aria-hidden="true" lang="ja">{mangaChapters.skills.sounds[index]}</span>
              </div>
              <div className={styles.body}>
                <div className={styles.domainRow}>
                  <h3>{blade.domain}</h3>
                  <span className={styles.domainMark} aria-hidden="true">↗</span>
                </div>
                <ul className={styles.tags}>
                  {blade.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.footer}>
          <span>{mangaChapters.skills.footer}</span>
          <span lang="ja">{mangaChapters.skills.footerJp}</span>
        </div>
      </div>
    </section>
  );
}
