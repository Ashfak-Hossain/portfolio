import { useRef } from 'react';
import type { Project } from '../../types/content';
import { gsap, useGSAP } from '../../lib/gsap';
import { useMotion } from '../../hooks/useMotion';
import { ImageSlot } from './ImageSlot';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
  index: number;
}

/** GitHub octocat mark. */
function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-1.95c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.75.81 1.2 1.84 1.2 3.1 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.05.78 2.12v3.14c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

/** One mosaic cell in the work grid. Reveals with a per-index stagger. */
export function ProjectCard({ project, index }: ProjectCardProps) {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reduced) {
        gsap.set(el, { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        el,
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: index * 0.05,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        },
      );
    },
    { scope: ref, dependencies: [reduced, index] },
  );

  const body = (
    <>
      <ImageSlot
        src={project.image}
        alt={`${project.name} screenshot`}
        placeholder="// drop screenshot"
      />
      {!project.image && <div className={styles.halftone} aria-hidden="true" />}
      <div className={styles.speedlines} aria-hidden="true" />
      <div className={styles.caption}>
        <div className={styles.capTop}>
          <span>
            {project.n} / {project.year}
          </span>
          <span className={styles.capMeta}>{project.stack}</span>
        </div>
        <div className={styles.capName}>{project.name}</div>
        <div className={styles.capDesc}>{project.desc}</div>
      </div>
    </>
  );

  const gridColumn = `span ${project.span}`;

  return (
    <article ref={ref} className={styles.card} style={{ gridColumn, opacity: 0 }}>
      {project.href ? (
        <a
          className={styles.cardMain}
          href={project.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`${project.name} — open live project`}
        >
          {body}
        </a>
      ) : (
        <div className={styles.cardMain}>{body}</div>
      )}

      {project.github && (
        <a
          className={styles.codeLink}
          href={project.github}
          target="_blank"
          rel="noreferrer"
          aria-label={`${project.name} — source code on GitHub`}
        >
          <GitHubMark />
          <span>CODE</span>
        </a>
      )}
    </article>
  );
}
