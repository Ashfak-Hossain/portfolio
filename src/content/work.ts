import type { Project } from '../types/content';

export const workBlurb = 'From resilient redirects to the front door of a live event. A few of the systems I’ve built along the way.';
export const workHeadingJp = '作品集';

export const workCopy = {
  chapter: '02 / SELECTED ARCS',
  title: ['EVERY BUILD.', 'A NEW ARC.'],
  narration: 'MEANWHILE, IN THE REAL WORLD…',
  count: 'PROJECTS',
  indexLabel: 'Jump to a project',
  projectLabel: 'ARC',
  live: 'Explore project',
  source: 'Source code',
  architecture: 'Architecture',
  notes: 'Inside the system',
  screenshotAlt: 'Application interface',
  screenshotLabel: 'ACTUAL PROJECT / LIVE INTERFACE',
  sketch: 'SYSTEM SKETCH',
  panelCaptions: {
    shortn: 'A SMALL LINK. A BIG JOURNEY.',
    nooverlap: 'ONE RESERVATION. NO COLLISIONS.',
    echoandaura: 'THE SHOW MUST GO ON.',
  } as Record<string, string>,
  soundEffects: {
    shortn: 'シュッ!!',
    nooverlap: 'ガキン!',
    echoandaura: 'ドン!!',
  } as Record<string, string>,
  reservation: {
    title: 'ONE SLOT.',
    subtitle: 'ONE OWNER.',
    label: 'RESERVATION LEDGER',
    times: ['09:00', '10:00', '11:00', '12:00'],
    confirmed: 'RESERVED',
    denied: 'OVERLAP REJECTED',
    seal: 'ENFORCED BY POSTGRES',
  },
  ticket: {
    eyebrow: 'LIVE FROM DHAKA',
    name: ['ECHO', '& AURA'],
    admit: 'ADMIT ONE',
    caption: 'FROM CHECKOUT TO CHECK-IN',
    stamp: 'OFFLINE SCAN',
  },
  footnote: 'Different challenges. The same obsession with the details.',
  next: 'KEEP READING',
} as const;

// Project scope and URLs restored from this portfolio's 3842402 revision.
// Performance figures are omitted until they can be linked to evidence.
export const projects: Project[] = [
  {
    slug: 'shortn',
    n: '01',
    name: 'SHORTN',
    category: 'Distributed URL shortener',
    stack: 'Go · PostgreSQL · Redis · Kubernetes',
    desc: 'Small links. A distributed system behind them. A URL shortener built around caching, message queues, resilience, and observability.',
    year: '2026',
    span: 12,
    kanji: '短',
    href: 'https://shortn.ashfak.dev/app',
    github: 'https://github.com/Ashfak-Hossain/shortn',
    image: '/assets/projects/project_shortn.webp',
    notes: [
      { label: 'THE SYSTEM', text: 'Go, PostgreSQL, and Redis work together behind the redirect flow, with message queues and observability around the service.' },
      { label: 'THE DELIVERY', text: 'Kubernetes and GitOps carry the application from code to deployment.' },
    ],
  },
  {
    slug: 'nooverlap',
    n: '02',
    name: 'NOOVERLAP',
    category: 'Booking without collisions',
    stack: 'NestJS · PostgreSQL · Redis · Outbox',
    desc: 'A booking platform with a simple rule: a reservation cannot overlap another. A PostgreSQL exclusion constraint enforces it at the database level.',
    year: '2026',
    span: 6,
    kanji: '唯',
    illustration: 'reservation',
    href: 'https://nooverlap.ashfak.dev',
    github: 'https://github.com/Ashfak-Hossain/noOverlap',
    image: null,
    notes: [
      { label: 'THE CONSTRAINT', text: 'The no-overlap rule lives in PostgreSQL as an exclusion constraint, so the database owns reservation integrity.' },
      { label: 'THE STACK', text: 'NestJS, PostgreSQL, Redis, and the outbox pattern form the booking system.' },
    ],
  },
  {
    slug: 'echoandaura',
    n: '03',
    name: 'ECHO & AURA',
    category: 'From the first ticket to the final encore',
    stack: 'Next.js · PostgreSQL · Redis · BullMQ',
    desc: 'Ticketing for a live-events organizer in Dhaka. Manually verified bKash payments, tickets by email, and a QR door scanner that works offline.',
    year: '2026',
    span: 6,
    kanji: '響',
    illustration: 'ticket',
    href: 'https://echoandaura.com',
    github: null,
    caseStudy: 'https://github.com/Ashfak-Hossain/EchoAndAura/blob/main/docs/ARCHITECTURE.md',
    image: null,
    notes: [
      { label: 'THE EXPERIENCE', text: 'The ticketing journey connects manually verified bKash payments, emailed tickets, and QR admission at the venue.' },
      { label: 'AT THE DOOR', text: 'An offline-capable QR scanner supports check-in when the venue connection is unreliable.' },
    ],
  },
];
