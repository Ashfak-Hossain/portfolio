import { useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { connect, identity } from '../../content';
import { edition } from '../../content/edition';
import { PirateMark } from '../ui/PirateMark';
import { gsap, useGSAP } from '../../lib/gsap';
import { useMotion } from '../../hooks/useMotion';
import styles from './Hero.module.css';

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const art = useRef<HTMLDivElement>(null);
  const [released, setReleased] = useState(false);
  const [touched, setTouched] = useState(false);
  const { reduced } = useMotion();
  const copy = edition.cover;
  const resume = connect.links.find((link) => link.label === 'RÉSUMÉ');

  const { contextSafe } = useGSAP(() => {
    if (reduced) {
      gsap.set('[data-cover-line]', { clearProps: 'transform,opacity' });
      gsap.set(art.current, { clearProps: 'transform,opacity' });
      return;
    }
    gsap.from('[data-cover-line]', { y: 50, opacity: 0, duration: .95, stagger: .1, ease: 'power3.out' });
    gsap.from(art.current, { rotate: 4, y: 35, opacity: 0, duration: 1.2, ease: 'power3.out', delay: .2 });
  }, { scope: root, dependencies: [reduced], revertOnUpdate: true });

  const tiltArt = contextSafe((element: HTMLDivElement, rotateX: number, rotateY: number, duration: number) => {
    gsap.to(element, { rotateX, rotateY, duration, overwrite: 'auto' });
  });

  const moveArt = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== 'mouse' || !art.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    tiltArt(art.current, -y * 5, x * 6, .6);
  };

  const resetArt = () => {
    if (reduced || !art.current) return;
    tiltArt(art.current, 0, 0, .8);
  };

  return (
    <header id="top" ref={root} className={`${styles.hero} ${released ? styles.released : ''}`}>
      <div className={styles.speedField} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.issueLine}>
          <span>{edition.masthead} <b>↳ {edition.issue}</b></span>
          <span>{copy.location}</span>
        </div>
        <div className={styles.cover}>
          <div className={styles.editorial}>
            <div className={styles.eyebrow} data-cover-line><PirateMark />{copy.eyebrow}</div>
            <h1 className={styles.name} aria-label={`${identity.first} ${identity.last} ${identity.given}`}>
              <span data-cover-line>{identity.first}<span className={styles.nameDot}>.</span></span>
              <span className={styles.secondName} data-cover-line>{identity.last} <i>{identity.given}</i></span>
            </h1>
            <div className={styles.role} data-cover-line><span>↳</span>{copy.role}</div>
            <p className={styles.subtitle} data-cover-line>{copy.subtitle}</p>
            <p className={styles.description} data-cover-line>{copy.description}</p>
            <div className={styles.actions} data-cover-line>
              <a className={styles.primary} href="#work">{copy.work}<span>↗</span></a>
              {resume?.href && <a className={styles.resume} href={resume.href} target="_blank" rel="noreferrer">{copy.resume}<span>↓</span></a>}
            </div>
            <div className={styles.handNote} aria-hidden="true"><span>↳</span> {copy.sideNote}</div>
          </div>
          <div className={styles.scene} onPointerMove={moveArt} onPointerLeave={resetArt}>
            <div className={styles.artBacking} aria-hidden="true" />
            <div className={styles.coverTag}>{copy.coverNote}<span>海賊</span></div>
            <div ref={art} className={styles.art}>
              <div className={styles.artFrame}>
                <img src="/assets/grand-line-cover.webp" alt={copy.imageAlt} fetchPriority="high" width="1122" height="1402" />
                <span className={styles.artChapter} aria-hidden="true">{copy.impact}</span>
                <span className={styles.verticalText} lang="ja" aria-hidden="true">{copy.vertical}</span>
              </div>
              <div className={styles.artCaption}><span>{copy.caption}</span><span>✳</span></div>
            </div>
            <div className={styles.speech} aria-hidden="true">{copy.speech.map((line, index) => <span key={line} className={index === 1 ? styles.speechAccent : undefined}>{line}</span>)}</div>
            <button type="button" className={styles.release} aria-pressed={released} aria-label={released ? copy.restore : copy.release} onClick={() => { setReleased((value) => !value); setTouched(true); }}>
              <span className={styles.releaseKanji} lang="ja">{copy.releaseJp}</span>
              <strong>{copy.releaseEn}</strong>
              <span>{released ? copy.restore : copy.release} ↗</span>
            </button>
            <span className={styles.releaseHint}>{copy.releaseHint}</span>
          </div>
        </div>
        <div className={styles.crewLine}><span aria-hidden="true">✦</span>{copy.crew}<span aria-hidden="true">✦</span></div>
        <div className={styles.bottomLine}><a href="#about"><span>↓</span>{copy.scroll}</a><span className={styles.volume}>壱 <i /> {copy.volume}</span><span>{copy.folio}</span></div>
      </div>
      <div className={styles.inkSlash} aria-hidden="true" />
      <div className={styles.hakiGlyph} lang="ja" aria-hidden="true">{copy.releaseJp}</div>
      <span className={styles.srOnly} role="status">{touched ? (released ? copy.releaseStatus : copy.normalStatus) : ''}</span>
    </header>
  );
}
