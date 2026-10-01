import type { About } from '../types/content';

export const about: About = {
  heading: ['I make computers do things.', 'Eventually.'],
  paragraphs: [
    "Final-year CS student. I got into competitive programming, which is a socially acceptable way to be furious at a problem for six hours and call it a hobby. It taught me to write code that's actually correct — turns out hidden test cases don't accept 'works on my machine.'",
    "What I actually do is chase the gap between a thing that works and a thing I understand — because those are rarely the same thing, and the space between them is where all the good bugs live. Domain's negotiable. The suspicion that my code is lying to me is permanent.",
  ],
  quote: 'Certainty is the first thing a compiler takes from you.',
  // Manga art generated from the portrait by scripts/manga-art (see README).
  // To use painted art instead, point `src` at your file and drop `widths`.
  splash: {
    wide: {
      src: '/assets/manga/about-eyes-wide-{w}.webp',
      widths: [1280, 1920, 2560],
      aspect: 3.5,
    },
    narrow: { src: '/assets/manga/about-eyes-{w}.webp', widths: [640, 960, 1280], aspect: 2 },
    alt: "Manga-style ink close-up of Ashfak's eyes",
    sfx: 'ジッ…',
  },
  face: {
    src: '/assets/manga/about-face-{w}.webp',
    widths: [480, 720, 960],
    aspect: 1,
    alt: 'Manga-style ink portrait of Ashfak',
  },
};
