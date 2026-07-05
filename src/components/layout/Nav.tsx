import { identity } from '../../content';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useMotion } from '../../hooks/useMotion';
import styles from './Nav.module.css';

export function Nav() {
  const { reduced } = useMotion();
  const logoRef = useMagnetic<HTMLAnchorElement>(!reduced);
  const contactRef = useMagnetic<HTMLAnchorElement>(!reduced);

  return (
    <nav className={styles.nav}>
      <a ref={logoRef} href="#top" className={styles.logo}>
        <span className={styles.mark}>{identity.logoKanji}</span>
        <span className={styles.logoWord}>{identity.short}</span>
      </a>

      <div className={styles.links}>
        <a className={styles.link} href="#about">
          About
        </a>
        <a className={styles.link} href="#work">
          Work
        </a>
        <a className={styles.link} href="#connect">
          Blog
        </a>
        <a ref={contactRef} className={styles.contact} href="#contact">
          Contact ↗
        </a>
      </div>
    </nav>
  );
}
