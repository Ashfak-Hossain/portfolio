import { footer } from '../../content';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useMotion } from '../../hooks/useMotion';
import styles from './Footer.module.css';

export function Footer() {
  const { reduced } = useMotion();
  const topRef = useMagnetic<HTMLAnchorElement>(!reduced);

  return (
    <footer className={styles.footer}>
      {/* Chapter-end mark, as printed at the close of a manga chapter. */}
      <p className={styles.tbc}>
        <span className={styles.tbcJp} lang="ja">
          つづく
        </span>
        <span className={styles.tbcEn}>To be continued</span>
      </p>
      <div className={styles.row}>
        <span>{footer.copyright}</span>
        <span className={styles.colophon}>{footer.colophon}</span>
        <a ref={topRef} href="#top" className={styles.top}>
          BACK TO TOP ↑
        </a>
      </div>
      <p className={styles.disclaimer}>{footer.disclaimer}</p>
    </footer>
  );
}
