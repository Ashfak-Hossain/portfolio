import { useRef } from 'react';
import type { RefObject } from 'react';
import type { Project } from '../../types/content';
import { gsap, useGSAP } from '../../lib/gsap';
import { useMotion } from '../../hooks/useMotion';
import { ImageSlot } from './ImageSlot';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
  index: number;
}

/** One mosaic cell in the work grid. Reveals with a per-index stagger. */
export function ProjectCard({ project, index }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement | HTMLAnchorElement>(null);
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

  if (project.href) {
    return (
      <a
        ref={ref as RefObject<HTMLAnchorElement>}
        className={styles.card}
        style={{ gridColumn, opacity: 0 }}
        href={project.href}
        target="_blank"
        rel="noreferrer"
      >
        {body}
      </a>
    );
  }

  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className={styles.card}
      style={{ gridColumn, opacity: 0 }}
    >
      {body}
    </div>
  );
}
