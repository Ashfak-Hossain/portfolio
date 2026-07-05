/**
 * Motion model — the resolved animation profile the whole app reads from.
 * The design's "Cinematic" look is the default; visitors who ask their OS for
 * reduced motion get "Subtle" (no theatrics, no smooth-scroll, static 3D).
 */

export type MotionProfileName = 'cinematic' | 'subtle';

export interface MotionProfile {
  name: MotionProfileName;
  /** True when prefers-reduced-motion is set. */
  reduced: boolean;
  /** Pointer-parallax depth multiplier. */
  parallaxDepth: number;
  /** Ambient spin-speed multiplier (0 pauses). */
  spinScale: number;
  /** Whether to run the hero scramble/decode. */
  scramble: boolean;
  /** Whether the one-cut section plays its full cinematic sequence. */
  slashTheatrics: boolean;
  /** Whether to enable Lenis smooth scrolling. */
  smoothScroll: boolean;
}
