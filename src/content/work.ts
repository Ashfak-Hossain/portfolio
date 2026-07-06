import type { Project } from '../types/content';

export const workBlurb = 'Two systems, each with a proof behind it.';
export const workHeadingJp = '作品集';

export const projects: Project[] = [
  {
    n: '01',
    name: 'DISTRIBUTED URL SHORTENER',
    stack: 'Go · PostgreSQL · Redis · k8s',
    desc: 'A distributed URL shortener with caching, message queue, resilience, observability, and a Kubernetes/GitOps deployment',
    year: '2026',
    span: 7,
    href: 'https://shortn.ashfak.dev/app',
    github: 'https://github.com/Ashfak-Hossain/shortn',
    image: '/assets/projects/project_shortn.webp',
  },
  // {
  //   n:
  //   name:
  //   stack:
  //   desc:
  //   year:
  //   span: 5
  //   href:
  //   github:
  //   image:
  // },
];
