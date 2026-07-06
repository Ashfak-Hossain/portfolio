import { useEffect, useState } from 'react';
import { identity } from '../../content';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useMotion } from '../../hooks/useMotion';
import styles from './Nav.module.css';

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  { href: '#skills', label: 'Skills' },
  { href: '#connect', label: 'Blog' },
];

export function Nav() {
  const { reduced } = useMotion();
  const logoRef = useMagnetic<HTMLAnchorElement>(!reduced);
  const contactRef = useMagnetic<HTMLAnchorElement>(!reduced);
  const [open, setOpen] = useState(false);

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <nav className={styles.nav}>
        <a ref={logoRef} href="#top" className={styles.logo} onClick={close}>
          <span className={styles.mark} lang="ja">
            {identity.logoKanji}
          </span>
          <span className={styles.logoWord}>{identity.short}</span>
        </a>

        {/* desktop inline links */}
        <div className={styles.links}>
          {LINKS.map((l) => (
            <a key={l.href} className={styles.link} href={l.href}>
              {l.label}
            </a>
          ))}
          <a ref={contactRef} className={styles.contact} href="#contact">
            Contact ↗
          </a>
        </div>

        {/* mobile hamburger */}
        <button
          type="button"
          className={styles.menuBtn}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className={styles.burger} data-open={open || undefined} />
        </button>
      </nav>

      {/* mobile slide-down menu */}
      <div id="mobile-menu" className={styles.mobileMenu} data-open={open || undefined}>
        {LINKS.map((l) => (
          <a key={l.href} className={styles.mobileLink} href={l.href} onClick={close}>
            {l.label}
          </a>
        ))}
        <a className={styles.mobileContact} href="#contact" onClick={close}>
          Contact ↗
        </a>
      </div>
    </>
  );
}
