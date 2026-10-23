import { projects, workBlurb, workHeadingJp } from '../../content';
import { workCopy } from '../../content/work';
import { Reveal } from '../ui/Reveal';
import { ProjectCard } from '../ui/ProjectCard';
import styles from './Work.module.css';

export function Work() {
  return (
    <section id="work" className={styles.work} aria-labelledby="work-heading">
      <div className={styles.inner}>
        <Reveal className={styles.chapterLine}>
          <span>{workCopy.chapter}</span>
          <span lang="ja">{workHeadingJp}</span>
          <span>{projects.length.toString().padStart(2, '0')} / {workCopy.count}</span>
        </Reveal>

        <Reveal className={styles.header}>
          <div className={styles.titlePanel}>
            <span className={styles.narration}>{workCopy.narration}</span>
            <h2 id="work-heading" className={styles.heading}>
              {workCopy.title[0]}<br />
              <span>{workCopy.title[1]}</span>
            </h2>
          </div>
          <div className={styles.intro}>
            <span className={styles.handArrow} aria-hidden="true">↙</span>
            <p className={styles.blurb}>{workBlurb}</p>
            <nav className={styles.index} aria-label={workCopy.indexLabel}>
              {projects.map((project) => (
                <a href={`#project-${project.slug ?? project.n}`} key={project.n}>
                  <span>{project.n}</span>
                  <span>{project.name}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </nav>
          </div>
        </Reveal>

        <div className={styles.grid}>
          {projects.map((project, index) => (
            <ProjectCard key={project.n} project={project} index={index} />
          ))}
        </div>

        <div className={styles.endnote}>
          <span>{workCopy.footnote}</span>
          <a href="#skills">{workCopy.next} <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>
  );
}
