import { useRef } from 'react';
import { identity, hero, stamp } from '../../content';
import { useMotion } from '../../hooks/useMotion';
import { useScramble } from '../../hooks/useScramble';
import { usePointerParallax } from '../../hooks/usePointerParallax';
import styles from './Hero.module.css';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scramble, parallaxDepth } = useMotion();

  useScramble(ref, scramble);
  usePointerParallax(ref, parallaxDepth);

  const [before, after] = hero.lede.split(hero.ledeEmphasis);

  return (
    <header id="top" ref={ref} className={styles.hero}>
      <div data-ambient className={styles.halftone} />
      <div className={styles.speedField}>
        <div data-ambient className={styles.speedSpin} />
      </div>

      <div className={styles.inner}>
        <div className={styles.topRow}>
          <span>{identity.edition}</span>
          <span className={styles.editionJp}>{identity.editionJp}</span>
        </div>

        <div className={styles.nameBlock} data-depth="-6">
          <div className={styles.nameLine} data-scramble>
            {identity.first}
          </div>
          <div className={`${styles.nameLine} ${styles.nameStroke}`} data-scramble>
            {identity.last}
          </div>
          <div className={styles.givenRow}>
            <span data-scramble>{identity.given}</span>
            <span className={styles.stamp}>{stamp.kanji}</span>
          </div>
        </div>

        <div className={styles.ledeRow}>
          <p className={styles.lede}>
            {before}
            <em>{hero.ledeEmphasis}</em>
            {after}
          </p>
          <div className={styles.scroll} data-ambient>
            SCROLL <span style={{ fontSize: 16 }}>↓</span>
          </div>
        </div>
      </div>

      <div className={styles.katakanaWrap}>
        <div className={styles.katakana} data-depth="10">
          {identity.katakana}
        </div>
      </div>
    </header>
  );
}
