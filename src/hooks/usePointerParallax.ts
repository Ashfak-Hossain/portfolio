import type { RefObject } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

/**
 * Pointer parallax. Every `[data-depth]` element inside `scope` drifts toward
 * the pointer by `depth * depthScale` pixels. Because it drives GSAP x/y
 * transforms, parallax layers must not rely on CSS `transform` for positioning.
 */
export function usePointerParallax(scope: RefObject<HTMLElement | null>, depthScale: number): void {
  useGSAP(
    () => {
      const container = scope.current;
      if (!container || depthScale === 0) return;

      const setters = gsap.utils.toArray<HTMLElement>('[data-depth]', container).map((el) => ({
        depth: Number(el.dataset.depth ?? 0) * depthScale,
        x: gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' }),
        y: gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' }),
      }));

      const onMove = (e: PointerEvent) => {
        const r = container.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width - 0.5;
        const cy = (e.clientY - r.top) / r.height - 0.5;
        setters.forEach((s) => {
          s.x(cx * s.depth);
          s.y(cy * s.depth);
        });
      };

      container.addEventListener('pointermove', onMove);
      return () => container.removeEventListener('pointermove', onMove);
    },
    { scope, dependencies: [depthScale] },
  );
}
