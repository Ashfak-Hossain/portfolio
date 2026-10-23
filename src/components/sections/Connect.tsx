import { connect } from '../../content';
import { edition } from '../../content/edition';
import { Reveal } from '../ui/Reveal';
import styles from './Connect.module.css';

function VoyageChart() {
  return (
    <svg className={styles.voyageChart} viewBox="0 0 560 500" fill="none" aria-hidden="true" focusable="false">
      <path d="m33 34 137-13 135 13 119-17 103 16-14 126 11 127-17 175-121 11-120-15-125 18-114-20 11-145-12-128Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
      <g stroke="var(--ink)" strokeWidth="1.5" opacity=".65">
        <path d="m87 95 34-16 28 8 22 25-11 31-35 14-24-13-22-31Zm-9-12 41-20 40 12 30 34-12 41-50 26-40-23-24-40Z" />
        <path d="m399 352 25-28 38 5 18 32-20 34-31 3-26-18Zm-14-9 34-36 54 6 24 49-26 47-49 8-37-28Z" />
        <path d="m82 366 23-16 19 12 3 23-25 10-22-12Zm-14-6 36-25 34 21 5 38-40 17-40-22Z" />
        <path d="M51 214h23m-12 10h28m364-30h29m-16 11h29M174 438h21m-13 9h26M385 86h25m-12 10h29" />
      </g>
      <path d="M109 374c100 14 39-147 149-126s138-58 169-103" stroke="var(--don-red)" strokeWidth="3" strokeDasharray="7 9" />
      <path d="m414 130 30 27m-2-29-26 31" stroke="var(--don-red)" strokeWidth="7" strokeLinecap="round" />
      <g transform="translate(449 93)" stroke="var(--ink)">
        <circle r="31" /><circle r="25" />
        <path d="M0-46 8-8 46 0 8 8 0 46-8 8-46 0-8-8Z" fill="var(--paper)" strokeWidth="1.5" />
        <path d="M0-46V0H46L8-8ZM0 46V0H-46L-8 8Z" fill="var(--ink)" />
      </g>
      <path d="m51 422 29 11-28 12m407-218 28-11-17-19" stroke="var(--ink)" strokeWidth="2" />
    </svg>
  );
}

function CrewEmblem() {
  return (
    <svg className={styles.crewEmblem} viewBox="0 0 120 100" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
        <path d="m25 51 73 40M22 88l75-39M20 47l8 7m65 33 9 8M17 91l9-7m68-32 8-7" />
      </g>
      <path d="M37 43c0-16 11-24 24-24s24 8 24 24v15L72 70v13H49V70L37 58Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
      <path d="M29 37h64M39 31c2-23 39-23 43 0" fill="var(--gold)" stroke="var(--ink)" strokeWidth="3" />
      <path d="M37 29h47v8H37Z" fill="var(--don-red)" stroke="var(--ink)" strokeWidth="2" />
      <ellipse cx="49" cy="52" rx="6" ry="7" fill="var(--ink)" /><ellipse cx="72" cy="52" rx="6" ry="7" fill="var(--ink)" />
      <path d="m60 59-4 6h8Zm-11 13h23M56 73v9m8-9v9" fill="var(--ink)" stroke="var(--ink)" strokeWidth="1.5" />
    </svg>
  );
}

export function Connect() {
  const copy = edition.journal;
  return (
    <section id="connect" className={styles.connect} aria-labelledby="journal-heading">
      <div className={styles.inner}>
        <div className={styles.chapter}><span>{copy.label}</span><span lang="ja">{copy.chapterJp}</span></div>
        <div className={styles.grid}>
          <Reveal className={styles.copy}>
            <span className={styles.eyebrow}>{copy.overline}</span>
            <h2 id="journal-heading" className={styles.heading}>{copy.title[0]}<span>{copy.title[1]}</span></h2>
            <p className={styles.blurb}>{connect.blurb}</p>
            {connect.blogHref && <a className={styles.cta} href={connect.blogHref} target="_blank" rel="noreferrer">{copy.cta} <span>↗</span></a>}
          </Reveal>
          <Reveal className={styles.notebookStage} delay={.1}>
            <VoyageChart />
            <a className={styles.notebook} href={connect.blogHref ?? '#connect'} target={connect.blogHref ? '_blank' : undefined} rel="noreferrer" aria-label={copy.cta}>
              <div className={styles.bookCover} aria-hidden="true">
                <div className={styles.bookMeta}><span>{copy.book.collection}</span><span>{edition.issue}</span></div>
                <span className={styles.bookKanji} lang="ja">{copy.book.mark}</span>
                <CrewEmblem />
                <span className={styles.bookTitle}>{copy.book.title[0]}<br />{copy.book.title[1]}<span>↗</span></span>
                <span className={styles.bookSub}>{copy.book.subtitle[0]}<br />{copy.book.subtitle[1]}</span>
                <div className={styles.bookBottom}><span>{copy.book.author}</span><span>✳</span></div>
              </div>
            </a>
            <span className={styles.annotation}>{copy.annotation} <span aria-hidden="true">↖</span></span>
          </Reveal>
        </div>
        <div className={styles.channelsLabel}>{copy.channels}</div>
        <div className={styles.socialGrid}>
          {connect.links.map((link) => link.href && (
            <a key={link.n} className={styles.social} href={link.href} target="_blank" rel="noreferrer">
              <span className={styles.socialNum}>{link.n}</span><span className={styles.socialLabel}>{link.label}</span><span className={styles.socialArrow}>↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
