import type { ReactNode } from 'react';
import styles from './Eyebrow.module.css';

interface EyebrowProps {
  children: ReactNode;
  align?: 'start' | 'center';
  tone?: 'ink' | 'paper' | 'haki';
}

/** The "01 — ABOUT" style section label with a short rule. */
export function Eyebrow({ children, align = 'start', tone = 'ink' }: EyebrowProps) {
  return (
    <div className={styles.eyebrow} data-align={align} data-tone={tone}>
      <span className={styles.rule} />
      <span>{children}</span>
      {align === 'center' && <span className={styles.rule} />}
    </div>
  );
}
