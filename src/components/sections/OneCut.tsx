import { Suspense, lazy, useRef, useState } from 'react';
import { oneCut } from '../../content';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { useMotion } from '../../hooks/useMotion';
import { Reveal } from '../ui/Reveal';
import { Eyebrow } from '../ui/Eyebrow';
import { KatanaFallback } from '../three/KatanaFallback';
import { SceneBoundary } from '../three/SceneBoundary';
import styles from './OneCut.module.css';

// The 3D scene (three + R3F) is code-split so it never touches first paint.
const KatanaScene = lazy(() => import('../three/KatanaScene'));

export function OneCut() {
  const { reduced } = useMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [cutTrigger, setCutTrigger] = useState(0);

  // Feed section scroll progress to the scene without re-rendering React.
  useGSAP(
    () => {
      if (reduced || !sectionRef.current) return;
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          progress.current = self.progress;
        },
      });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  const flash = () => {
    if (flashRef.current) {
      gsap.fromTo(
        flashRef.current,
        { opacity: 0.9 },
        { opacity: 0, duration: 0.5, ease: 'power2.out' },
      );
    }
  };

  const headingHead = oneCut.heading.replace(oneCut.headingAccentWord, '');

  const sceneFallback = (
    <div className={styles.fallbackWrap}>
      <KatanaFallback />
    </div>
  );

  return (
    <>
      <section ref={sectionRef} id="blades" className={styles.section}>
        <div data-ambient className={styles.clouds} />
        <div data-ambient className={styles.mist} />
        <div className={styles.watermark} lang="ja" aria-hidden="true">
          {oneCut.watermark}
        </div>

        <div className={styles.canvasWrap}>
          {reduced ? (
            sceneFallback
          ) : (
            <SceneBoundary fallback={sceneFallback}>
              <Suspense fallback={sceneFallback}>
                <KatanaScene
                  progressRef={progress}
                  onApex={flash}
                  reduced={reduced}
                  cutTrigger={cutTrigger}
                />
              </Suspense>
            </SceneBoundary>
          )}
        </div>

        <Reveal className={styles.copy} y={20}>
          <div className={styles.copyInner}>
            <Eyebrow align="center" tone="haki">
              <span lang="ja">{oneCut.eyebrow}</span>
            </Eyebrow>
            <h2 className={styles.heading}>
              {headingHead}
              <span className={styles.accent}>{oneCut.headingAccentWord}</span>
            </h2>
            <p className={styles.body}>{oneCut.body}</p>
          </div>
        </Reveal>

        <div className={styles.caption}>{oneCut.caption}</div>
        <div ref={flashRef} className={styles.flash} aria-hidden="true" />

        {!reduced && (
          <button
            type="button"
            className={styles.replay}
            onClick={() => {
              setCutTrigger((n) => n + 1);
              flash();
            }}
          >
            <span className={styles.replayKanji} lang="ja" aria-hidden="true">
              斬
            </span>
            REPLAY CUT
          </button>
        )}
      </section>

      <div aria-hidden="true" className={styles.transition}>
        <div className={styles.transitionGlow} />
        <div className={styles.transitionFill} />
        <div className={styles.transitionEdge} />
      </div>
    </>
  );
}
