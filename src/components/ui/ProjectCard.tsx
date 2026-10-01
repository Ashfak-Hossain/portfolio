import { useRef } from 'react';
import type { Project } from '../../types/content';
import { gsap, useGSAP } from '../../lib/gsap';
import { useMotion } from '../../hooks/useMotion';
import { ImageSlot } from './ImageSlot';
import styles from './ProjectCard.module.css';

/** Which panel edges meet a neighbour on the same row (and get slanted). */
export interface PanelCut {
  left: boolean;
  right: boolean;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  cut: PanelCut;
}

const JP_NUM = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const METRIC_CHARS = '0123456789→';

/** GitHub octocat mark. */
function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-1.95c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.75.81 1.2 1.84 1.2 3.1 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.05.78 2.12v3.14c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

/** Open-book mark for the case-study link. */
function BookMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 5c3-1.5 6.5-1.5 10 1 3.5-2.5 7-2.5 10-1v14c-3-1.5-6.5-1.5-10 1-3.5-2.5-7-2.5-10-1z" />
      <path d="M12 6v14" />
    </svg>
  );
}

/**
 * One manga panel on the Work page: chapter tag, the art (screenshot or a
 * brushed kanji until there is one), the proof metric, and a katakana SFX
 * that bursts in on hover. Reveals with a per-index stagger; the metric
 * decodes like the hero name.
 */
export function ProjectCard({ project, index, cut }: ProjectCardProps) {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useMotion();
  const descId = `project-${project.slug}-desc`;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reduced) {
        gsap.set(el, { opacity: 1, y: 0 });
        return;
      }
      const metric = el.querySelector<HTMLElement>('[data-metric]');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        delay: index * 0.08,
      });
      tl.fromTo(el, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
      if (metric) {
        tl.to(
          metric,
          {
            duration: 0.9,
            ease: 'none',
            scrambleText: {
              text: metric.textContent ?? '',
              chars: METRIC_CHARS,
              revealDelay: 0.2,
              speed: 0.6,
            },
          },
          0.25,
        );
      }
    },
    { scope: ref, dependencies: [reduced, index] },
  );

  const chapterJp = `第${JP_NUM[index] ?? project.n}話`;

  const body = (
    <>
      <div className={styles.art}>
        {project.image ? (
          <ImageSlot src={project.image} alt={`${project.name} screenshot`} />
        ) : (
          <div className={styles.placeholderArt} aria-hidden="true">
            <span className={styles.bigKanji} lang="ja">
              {project.kanji}
            </span>
          </div>
        )}
      </div>
      <div className={styles.speedlines} aria-hidden="true" />
      <span className={styles.sfx} lang="ja" aria-hidden="true">
        {project.sfx}
      </span>

      <div className={styles.tag}>
        <span className={styles.chapter}>
          <span lang="ja" className={styles.chapterJp}>
            {chapterJp}
          </span>
          <span>CH.{project.n}</span>
        </span>
        {project.status && (
          <span className={styles.status}>
            <span className={styles.statusDot} aria-hidden="true" />
            {project.status}
          </span>
        )}
      </div>

      <div className={styles.caption}>
        <div className={styles.capTop}>
          <span>{project.year}</span>
          <span className={styles.capMeta}>{project.stack}</span>
        </div>
        {project.metric && (
          <div className={styles.metric}>
            <span className={styles.metricValue} data-metric>
              {project.metric.value}
            </span>
            <span className={styles.metricLabel}>{project.metric.label}</span>
          </div>
        )}
        <h3 className={styles.capName}>{project.name}</h3>
        <p className={styles.capDesc} id={descId}>
          {project.desc}
        </p>
      </div>
    </>
  );

  return (
    <article
      ref={ref}
      id={`project-${project.slug}`}
      className={styles.card}
      data-tone={project.tone}
      data-cut-left={cut.left || undefined}
      data-cut-right={cut.right || undefined}
      style={{ gridColumn: `span ${project.span}`, opacity: 0 }}
    >
      {project.href ? (
        <a
          className={styles.cardMain}
          href={project.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`${project.name} — open live project`}
          aria-describedby={descId}
        >
          {body}
        </a>
      ) : (
        <div className={styles.cardMain}>{body}</div>
      )}

      {(project.github || project.caseStudy) && (
        <div className={styles.actions}>
          {project.caseStudy && (
            <a
              className={styles.action}
              href={project.caseStudy}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.name} — case study`}
            >
              <BookMark />
              <span>CASE STUDY</span>
            </a>
          )}
          {project.github && (
            <a
              className={styles.action}
              href={project.github}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.name} — source code on GitHub`}
            >
              <GitHubMark />
              <span>CODE</span>
            </a>
          )}
        </div>
      )}
    </article>
  );
}
