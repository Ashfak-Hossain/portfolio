import type { ReactNode } from 'react';
import styles from './Eyebrow.module.css';

interface EyebrowProps {
  children: ReactNode;
  num?: string; // Japanese no. 一, 二, 三
  tone?: 'ink' | 'paper' | 'haki';
}

/** The "一 — About" style section label: a short rule, a JP numeral, the label.
 *  Always left-aligned so every section reads the same. */
export function Eyebrow({ children, num, tone = 'ink' }: EyebrowProps) {
  return (
    <div className={styles.eyebrow} data-tone={tone}>
      <span className={styles.rule} />
      {num && (
        <>
          <span lang="ja" className={styles.num}>
            {num}
          </span>
          <span aria-hidden="true" className={styles.dash}>
            —
          </span>
        </>
      )}
      <span>{children}</span>
    </div>
  );
}
