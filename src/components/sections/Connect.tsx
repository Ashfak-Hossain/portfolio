import { connect } from '../../content';
import { Reveal } from '../ui/Reveal';
import { Eyebrow } from '../ui/Eyebrow';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useMotion } from '../../hooks/useMotion';
import styles from './Connect.module.css';

export function Connect() {
  const { reduced } = useMotion();
  const blogRef = useMagnetic<HTMLAnchorElement>(!reduced);
  const blog = connect.blogHref;

  return (
    <section id="connect" className={styles.connect}>
      <div data-ambient className={styles.spinner} />

      <div className={styles.inner}>
        <Reveal>
          <Eyebrow tone="paper">03 — The Log</Eyebrow>
          <a
            ref={blogRef}
            className={styles.blogLink}
            href={blog ?? '#connect'}
            {...(blog ? { target: '_blank', rel: 'noreferrer' } : {})}
          >
            <h2 className={styles.heading}>
              READ THE
              <br />
              BLOG <span className={styles.arrow}>↗</span>
            </h2>
          </a>
          <p className={styles.blurb}>{connect.blurb}</p>
        </Reveal>

        <Reveal className={styles.socialGrid} delay={0.1}>
          {connect.links.map((link) => {
            // http(s) links open in a new tab;
            const newTab = link.href?.startsWith('http');
            return (
              <a
                key={link.n}
                className={styles.social}
                href={link.href ?? '#connect'}
                {...(newTab ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                <span className={styles.socialNum}>{link.n}</span>
                <span className={styles.socialLabel}>{link.label} ↗</span>
              </a>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
