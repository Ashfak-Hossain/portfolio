/**
 * Content model — the shape of everything editable in `src/content`.
 * Keeping these types separate from the data lets components depend on the
 * contract, not the values.
 */

export interface Identity {
  /** Kanji shown in the nav mark + favicon. */
  logoKanji: string;
  short: string;
  first: string;
  last: string;
  given: string;
  /** Vertical katakana rendered down the hero's right edge. */
  katakana: string;
  edition: string;
  editionJp: string;
}

/** The 2-kanji motif word shown in the hero badge and the ink-brush impact panel. */
export interface Stamp {
  /* 2-kanji word (正解). */
  kanji: string;
  /* English gloss, shown spaced under the impact */
  gloss: string;
  /* Romaji reading. */
  romaji: string;
  /* hanko */
  seal: string;
  meaning: string;
}

export interface Hero {
  lede: string;
  /** Substring of `lede` rendered emphasized (italic). */
  ledeEmphasis: string;
}

export interface About {
  heading: [string, string];
  paragraphs: string[];
  quote: string;
}

export interface Poster {
  name: string;
  role: string;
  numberJp: string;
  bounty: string;
  /** Imported image URL, or null to show the placeholder. */
  portrait: string | null;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface Project {
  n: string;
  name: string;
  stack: string;
  desc: string;
  year: string;
  /** Column footprint on the 12-col mosaic (1–12). */
  span: number;
  href: string | null;
  image: string | null;
}

export interface SocialLink {
  n: string;
  label: string;
  href: string | null;
}

export interface OneCut {
  eyebrow: string;
  heading: string;
  /** Word within `heading` tinted with the haki accent. */
  headingAccentWord: string;
  body: string;
  caption: string;
  watermark: string;
}

export interface Connect {
  blurb: string;
  links: SocialLink[];
  blogHref: string | null;
}

export interface Contact {
  heading: string;
  sub: string;
  successJp: string;
  success: string;
  successNote: string;
  /** Form POST endpoint (Formspree/Getform). null = decorative, sends nothing. */
  endpoint: string | null;
}

export interface Footer {
  copyright: string;
  colophon: string;
}
