import { footer } from '../../content';
import { edition } from '../../content/edition';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.endTitle}><span>{edition.footer.statement}</span><a href="#top" aria-label={edition.navigation.back}><span aria-hidden="true">↗</span></a></div>
        <div className={styles.row}><span>{footer.copyright}</span><span>{edition.footer.note}</span><a href="#top">{edition.footer.back}</a></div>
        <p className={styles.disclaimer}>{footer.disclaimer}</p>
      </div>
    </footer>
  );
}
