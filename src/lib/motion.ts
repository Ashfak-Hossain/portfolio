/**
 * Motion profiles. Pure data + a resolver — no React here so it can be used
 * anywhere. The design's "Cinematic" look is the default; reduced-motion users
 * get "Subtle".
 */
import type { MotionProfile } from '../types/motion';

export const CINEMATIC: MotionProfile = {
  name: 'cinematic',
  reduced: false,
  parallaxDepth: 1,
  spinScale: 1,
  scramble: true,
  slashTheatrics: true,
  smoothScroll: true,
};

export const SUBTLE: MotionProfile = {
  name: 'subtle',
  reduced: true,
  parallaxDepth: 0.35,
  spinScale: 0,
  scramble: false,
  slashTheatrics: false,
  smoothScroll: false,
};

export function resolveMotionProfile(reduced: boolean): MotionProfile {
  return reduced ? SUBTLE : CINEMATIC;
}
