import { edition } from '../../content/edition';
import styles from './InkImpact.module.css';

export function InkImpact() {
  return (
    <div className={styles.interlude}>
      <div className={styles.tape}>
        {edition.interlude.words.map((word) => <span key={word}><i aria-hidden="true">✳</i>{word}</span>)}
      </div>
      <div className={styles.note}><span>{edition.interlude.note}</span><span><b lang="ja">{edition.interlude.mark}</b>{edition.interlude.translation} ↘</span></div>
    </div>
  );
}
