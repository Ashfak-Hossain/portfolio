import { useRef } from 'react';
import { poster } from '../../content';
import { gsap, useGSAP } from '../../lib/gsap';
import { useMotion } from '../../hooks/useMotion';
import { ImageSlot } from './ImageSlot';
import styles from './WantedPoster.module.css';

/** The "for hire" WANTED poster: reveals on scroll, then slams the 採用/HIRED stamp. */
export function WantedPoster() {
  const root = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      const el = root.current;
      const stamp = stampRef.current;
      if (!el || !stamp) return;

      if (reduced) {
        gsap.set(el, { opacity: 1, y: 0, rotation: -1.6 });
        gsap.set(stamp, { opacity: 0.74, scale: 1 });
        return;
      }

      gsap
        .timeline({ scrollTrigger: { trigger: el, start: 'top 78%', once: true } })
        .fromTo(
          el,
          { opacity: 0, y: 42, rotation: -6 },
          { opacity: 1, y: 0, rotation: -1.6, duration: 0.9, ease: 'power3.out' },
        )
        .fromTo(
          stamp,
          { opacity: 0, scale: 2.6 },
          { opacity: 0.74, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
          '-=0.15',
        );

      // hover tilt
      const enter = () => gsap.to(el, { rotation: 0.6, y: -5, duration: 0.5, ease: 'power2.out' });
      const leave = () => gsap.to(el, { rotation: -1.6, y: 0, duration: 0.5, ease: 'power2.out' });
      el.addEventListener('pointerenter', enter);
      el.addEventListener('pointerleave', leave);
      return () => {
        el.removeEventListener('pointerenter', enter);
        el.removeEventListener('pointerleave', leave);
      };
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div ref={root} className={styles.poster} style={{ opacity: 0 }}>
      <div className={`${styles.tape} ${styles.tapeLeft}`} />
      <div className={`${styles.tape} ${styles.tapeRight}`} />
      <div className={styles.shadow} />

      <div className={styles.parchment}>
        <div className={styles.frame}>
          <div className={styles.wanted}>WANTED</div>

          <div className={styles.portraitBox}>
            <ImageSlot
              src={poster.portrait}
              alt="Portrait of Ashfak Hossain Evan"
              placeholder="// drop portrait"
              background="#cbb98e"
            />
            <div className={styles.vignette} />
            <div className={styles.tint} />
          </div>

          <div className={styles.band}>
            <span className={styles.bandRule} />
            <span className={styles.bandDiamond} aria-hidden="true">
              ◆
            </span>
            <div className={styles.bandText}>DEAD OR ALIVE</div>
            <span className={styles.bandDiamond} aria-hidden="true">
              ◆
            </span>
            <span className={styles.bandRule} />
          </div>

          <div className={styles.name}>{poster.name}</div>
          <div className={styles.role}>
            {poster.role}&nbsp;·&nbsp;
            <span className={styles.jp} lang="ja">
              {poster.numberJp}
            </span>
          </div>

          <div className={styles.bounty}>
            <span className={styles.berry}>
              B
              <span className={`${styles.berryBar} ${styles.berryBar1}`} />
              <span className={`${styles.berryBar} ${styles.berryBar2}`} />
            </span>
            <span className={styles.bountyNum}>{poster.bounty}</span>
          </div>

          <div className={styles.footerRow}>
            <span className={styles.anchor} aria-hidden="true">
              ⚓
            </span>
            <div className={styles.bureau}>
              <span className={styles.bureauRule} />
              ENGINEERING BUREAU
              <span className={styles.jp} lang="ja">
                ·海軍
              </span>
              <span className={styles.bureauRule} />
            </div>
            <span className={styles.anchor} aria-hidden="true">
              ⚓
            </span>
          </div>
        </div>

        <div className={styles.hanko} lang="ja" aria-hidden="true">
          求人
        </div>

        <div ref={stampRef} className={styles.stamp}>
          <div className={styles.stampJp} lang="ja">
            採用
          </div>
          {/* <div className={styles.stampEn}>HIRED</div> */}
        </div>
      </div>
    </div>
  );
}
