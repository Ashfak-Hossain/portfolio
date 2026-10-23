import { useRef } from 'react';
import type { Project } from '../../types/content';
import { workCopy } from '../../content/work';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { useMotion } from '../../hooks/useMotion';
import styles from './ProjectCard.module.css';

interface ProjectCardProps { project: Project; index: number; }

function ArrowMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M5 19 19 5M5 5h14v14" />
    </svg>
  );
}

function ReservationArt() {
  const copy = workCopy.reservation;
  return (
    <div className={styles.reservation} aria-hidden="true">
      <div className={styles.reservationHeadline}>{copy.title}<br /><span>{copy.subtitle}</span></div>
      <div className={styles.ledger}>
        <div className={styles.ledgerHeader}><span>{copy.label}</span><span>↙</span></div>
        <div className={styles.timeline}>
          <div className={styles.hours}>{copy.times.map((time) => <span key={time}>{time}</span>)}</div>
          <div className={styles.booking}>{copy.confirmed}<span>✓</span></div>
          <div className={styles.conflict}><span>{copy.denied}</span><b>×</b></div>
        </div>
        <div className={styles.ledgerSeal}>{copy.seal}<span>◆</span></div>
      </div>
    </div>
  );
}

function TicketArt() {
  const copy = workCopy.ticket;
  return (
    <div className={styles.ticketArt} aria-hidden="true">
      <div className={styles.ticketEcho}>{copy.name[0]}<br />{copy.name[1]}</div>
      <div className={styles.ticket}>
        <div className={styles.ticketMain}>
          <span className={styles.ticketEyebrow}>{copy.eyebrow}<span>✦</span></span>
          <div className={styles.ticketName}>{copy.name[0]}<br />{copy.name[1]}</div>
          <span className={styles.ticketCaption}>{copy.caption}</span>
        </div>
        <div className={styles.ticketStub}>
          <span>{copy.admit}</span><div className={styles.barcode} /><b>EA—003</b>
        </div>
      </div>
      <span className={styles.ticketStamp}>{copy.stamp}<span>↗</span></span>
    </div>
  );
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useMotion();
  const slug = project.slug ?? project.n;
  const featured = index === 0;

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) { gsap.set(el, { opacity: 1, y: 0 }); return; }
    gsap.fromTo(el, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 94%', once: true },
    });
  }, { scope: ref, dependencies: [reduced], revertOnUpdate: true });

  return (
    <article id={`project-${slug}`} ref={ref}
      className={`${styles.card} ${featured ? styles.featured : ''}`}
      data-illustration={project.illustration}
      aria-labelledby={`project-${slug}-title`}
      style={{ gridColumn: `span ${project.span}` }}>
      <div className={styles.topline}>
        <span>{workCopy.projectLabel} {project.n} <span className={styles.toplineSlash}>/</span> {project.category}</span>
        <span>{project.year}</span>
      </div>
      <div className={styles.main}>
        <div className={styles.art}>
          <span className={styles.artNumber} aria-hidden="true">{project.n}</span>
          {workCopy.panelCaptions[slug] && <span className={styles.narration}>{workCopy.panelCaptions[slug]}</span>}
          {workCopy.soundEffects[slug] && <span className={styles.soundEffect} lang="ja" aria-hidden="true">{workCopy.soundEffects[slug]}</span>}
          {project.image ? (
            <div className={styles.browserFrame}>
              <div className={styles.browserBar}>
                <span className={styles.browserDots}><i /><i /><i /></span>
                <span>{project.href && new URL(project.href).hostname}</span><span aria-hidden="true">↗</span>
              </div>
              <img src={project.image} alt={`${project.name} — ${workCopy.screenshotAlt}`} loading="lazy" width="2860" height="1350" />
            </div>
          ) : project.illustration === 'reservation' ? <ReservationArt /> : project.illustration === 'ticket' ? <TicketArt /> : null}
          <span className={styles.artCaption}>{project.image ? workCopy.screenshotLabel : workCopy.sketch}</span>
          <span className={styles.kanji} lang="ja" aria-hidden="true">{project.kanji}</span>
        </div>
        <div className={styles.content}>
          <div className={styles.titleRow}>
            <h3 id={`project-${slug}-title`} className={styles.name}>{project.name}</h3>
          </div>
          <p className={styles.desc}>{project.desc}</p>
          <ul className={styles.stack} aria-label={`${project.name} technology stack`}>
            {project.stack.split(' · ').map((technology) => <li key={technology}>{technology}</li>)}
          </ul>
          <div className={styles.actions}>
            {project.href && (
              <a className={styles.liveLink} href={project.href} target="_blank" rel="noreferrer" aria-label={`${workCopy.live}: ${project.name} (opens in a new tab)`}>
                <span>{workCopy.live}</span><ArrowMark />
              </a>
            )}
            {project.github && (
              <a className={styles.sourceLink} href={project.github} target="_blank" rel="noreferrer" aria-label={`${project.name}: ${workCopy.source} (opens in a new tab)`}>
                <span aria-hidden="true">{'</>'}</span>{workCopy.source}
              </a>
            )}
            {project.caseStudy && (
              <a className={styles.sourceLink} href={project.caseStudy} target="_blank" rel="noreferrer" aria-label={`${project.name}: ${workCopy.architecture} (opens in a new tab)`}>
                {workCopy.architecture}<ArrowMark />
              </a>
            )}
          </div>
        </div>
      </div>
      {project.notes && project.notes.length > 0 && (
        <details className={styles.notes} onToggle={() => { if (!reduced) ScrollTrigger.refresh(); }}>
          <summary><span>{workCopy.notes}</span><span className={styles.notesIcon} aria-hidden="true">+</span></summary>
          <div className={styles.notesGrid}>
            {project.notes.map((note) => <div key={note.label}><h4>{note.label}</h4><p>{note.text}</p></div>)}
          </div>
        </details>
      )}
    </article>
  );
}
