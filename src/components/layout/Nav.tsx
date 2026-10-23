import { useEffect, useRef, useState } from 'react';
import { identity } from '../../content';
import { edition } from '../../content/edition';
import { PirateMark } from '../ui/PirateMark';
import styles from './Nav.module.css';

export function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(`#${entry.target.id}`);
      });
    }, { rootMargin: '-18% 0px -50% 0px' });
    document.querySelectorAll('main > section[id], main > header[id]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <nav className={styles.nav} aria-label={edition.navigation.label}>
        <div className={styles.inner}>
          <a href="#top" className={styles.logo} onClick={close} aria-label={`${identity.short} — ${edition.navigation.back}`}>
            <span className={styles.mark}><PirateMark /></span>
            <span className={styles.logoWord}>{identity.short}<small>{edition.navigation.tagline}</small></span>
          </a>
          <div className={styles.links}>
            {edition.nav.map((link) => (
              <a key={link.href} className={styles.link} href={link.href} aria-current={active === link.href ? 'location' : undefined}>
                <span>{link.number}</span>{link.label}
              </a>
            ))}
          </div>
          <a className={styles.contact} href="#contact" onClick={close}>{edition.contact} <span>↗</span></a>
          <button ref={toggle} type="button" className={styles.menuBtn} aria-label={open ? edition.navigation.close : edition.navigation.open} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((value) => !value)}>
            <span className={styles.burger} data-open={open || undefined} />
          </button>
        </div>
      </nav>
      <div id="mobile-menu" className={styles.mobileMenu} data-open={open || undefined} data-lenis-prevent inert={!open}>
        {edition.nav.map((link) => (
          <a key={link.href} className={styles.mobileLink} href={link.href} onClick={close} aria-current={active === link.href ? 'location' : undefined}>
            <span>{link.number}</span>{link.label}<span>↗</span>
          </a>
        ))}
        <a className={styles.mobileContact} href="#contact" onClick={close}>{edition.contact} ↗</a>
      </div>
    </>
  );
}
