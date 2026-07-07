import { projects, workBlurb, workHeadingJp } from '../../content';
import { Reveal } from '../ui/Reveal';
import { Eyebrow } from '../ui/Eyebrow';
import { ProjectCard } from '../ui/ProjectCard';
import styles from './Work.module.css';

export function Work() {
  return (
    <section id="work" className={styles.work}>
      <div className={styles.inner}>
        <Reveal className={styles.header}>
          <div>
            <Eyebrow num="二">Selected Work</Eyebrow>
            <h2 className={styles.heading}>
              The Arc Log <span className={styles.headingJp}>{workHeadingJp}</span>
            </h2>
          </div>
          <p className={styles.blurb}>{workBlurb}</p>
        </Reveal>

        <div className={styles.grid}>
          {projects.map((project, index) => (
            <ProjectCard key={project.n} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
