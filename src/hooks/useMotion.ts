import type { MotionProfile } from '../types/motion';
import { resolveMotionProfile } from '../lib/motion';
import { useReducedMotion } from './useReducedMotion';

/** The resolved motion profile for the current visitor. */
export function useMotion(): MotionProfile {
  return resolveMotionProfile(useReducedMotion());
}
