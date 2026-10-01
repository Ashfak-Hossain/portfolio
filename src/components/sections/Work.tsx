import { projects, workBlurb, workHeadingJp } from '../../content';
import type { Project } from '../../types/content';
import { Reveal } from '../ui/Reveal';
import { Eyebrow } from '../ui/Eyebrow';
import { ProjectCard } from '../ui/ProjectCard';
import type { PanelCut } from '../ui/ProjectCard';
import styles from './Work.module.css';

const COLS = 12;

/**
 * Which edges of each panel touch a neighbour on the same row of the 12-col
 * grid. Those edges get the slanted manga gutter; outer edges stay square.
 */
function panelCuts(list: Project[]): PanelCut[] {
  let col = 0;
  return list.map((p, i) => {
    const span = Math.min(Math.max(p.span, 1), COLS);
    if (col + span > COLS) col = 0;
    const startsRow = col === 0;
    col += span;
    const next = list[i + 1];
    const endsRow = !next || col + Math.min(next.span, COLS) > COLS;
    if (endsRow) col = 0;
    return { left: !startsRow, right: !endsRow };
  });
}

export function Work() {
  const cuts = panelCuts(projects);

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
            <ProjectCard key={project.slug} project={project} index={index} cut={cuts[index]} />
          ))}
        </div>
      </div>
    </section>
  );
}
