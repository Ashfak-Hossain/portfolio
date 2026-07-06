import type { SkillBlade } from '../types/content';

export const skillsHeadingJp = '三刀流';
export const skillsHeading = 'THREE-SWORD STYLE';
export const skillsBlurb =
  'One blade is never enough. Three disciplines — carried at once, drawn as one.';

// Each blade = one skill domain. Edit tags freely; add/remove is safe.
export const skills: SkillBlade[] = [
  {
    kanji: '和',
    sword: 'Wadō Ichimonji',
    swordJp: '和道一文字',
    domain: 'LANGUAGES',
    tags: ['C++', 'Go', 'C#', 'PHP'],
    aura: 'white',
  },
  {
    kanji: '鬼',
    sword: 'Sandai Kitetsu',
    swordJp: '三代鬼徹',
    domain: 'CLOUD & INFRA',
    tags: ['AWS', 'Docker', 'Kubernetes', 'DigitalOcean'],
    aura: 'cursed',
  },
  {
    kanji: '閻',
    sword: 'Enma',
    swordJp: '閻魔',
    domain: 'THE CRAFT',
    tags: ['Competitive Programming', 'React', 'Next.js'],
    aura: 'haki',
  },
];
