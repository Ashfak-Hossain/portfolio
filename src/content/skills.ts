import type { SkillBlade } from '../types/content';

export const skillsHeadingJp = '三刀流';
export const skillsHeading = 'THREE-SWORD';
export const skillsBlurb =
  'One blade is never enough. Three disciplines — carried at once, drawn as one.';

export const skills: SkillBlade[] = [
  {
    kanji: '和',
    sword: 'Wadō Ichimonji',
    swordJp: '和道一文字',
    domain: 'LANGUAGES',
    tags: ['C++', 'Go', 'C#', 'TypeScript / JS', 'Python'],
    aura: 'white',
  },
  {
    kanji: '鬼',
    sword: 'Sandai Kitetsu',
    swordJp: '三代鬼徹',
    domain: 'CLOUD & INFRA',
    tags: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Linux'],
    aura: 'cursed',
  },
  {
    kanji: '閻',
    sword: 'Enma',
    swordJp: '閻魔',
    domain: 'THE CRAFT',
    tags: ['React', 'Next.js', 'NestJS', 'Node.js', 'PostgreSQL', 'Redis', 'Distributed System'],
    aura: 'haki',
  },
];
