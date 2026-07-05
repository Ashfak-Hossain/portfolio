import { useRef } from 'react';
import type { RefObject } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

/**
 * Magnetic pointer follow. Returns a ref to attach to the element you want to
 * pull toward the cursor on hover. Disabled (identity) when `enabled` is false.
 *
 *   const ref = useMagnetic<HTMLAnchorElement>()
 *   <a ref={ref}>…</a>
 */
export function useMagnetic<T extends HTMLElement>(
  enabled = true,
  strength = 0.3,
): RefObject<T | null> {
  const ref = useRef<T>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !enabled) return;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' });

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const reset = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', reset);
      return () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', reset);
      };
    },
    { scope: ref, dependencies: [enabled, strength] },
  );
  return ref;
}
