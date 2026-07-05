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
          <span className={styles.editionJp} lang="ja">
            {identity.editionJp}
          </span>
        </div>

        <h1 className={styles.nameBlock} data-depth="-6">
          <span className={styles.nameLine} data-scramble>
            {identity.first}
          </span>
          <span className={`${styles.nameLine} ${styles.nameStroke}`} data-scramble>
            {identity.last}
          </span>
          <span className={styles.givenRow}>
            <span data-scramble>{identity.given}</span>
            <span className={styles.stamp} lang="ja">
              {stamp.kanji}
            </span>
          </span>
        </h1>

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

      <div className={styles.katakanaWrap} aria-hidden="true">
        <div className={styles.katakana} data-depth="10">
          {identity.katakana}
        </div>
      </div>
    </header>
  );
}
