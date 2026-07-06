import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

interface InView<T extends Element> {
  ref: RefObject<T | null>;
  /** Sticky: flips true the first time the element nears the viewport and
   *  stays true — use it to gate mounting an expensive subtree once. */
  hasEntered: boolean;
  /** Live: true only while the element is on/near screen — use it to pause
   *  work (e.g. a render loop) when scrolled away. */
  visible: boolean;
}

/**
 * Observe an element's viewport proximity. `rootMargin` preloads slightly
 * before it scrolls in. Falls back to "always in view" when
 * IntersectionObserver is unavailable (very old browsers / SSR).
 */
export function useInView<T extends Element>(rootMargin = '600px 0px'): InView<T> {
  const ref = useRef<T>(null);
  // When IntersectionObserver is unavailable (very old browsers / SSR), fall
  // back to "always in view" — decided at init so we never setState in-effect.
  const supported = typeof IntersectionObserver !== 'undefined';
  const [hasEntered, setHasEntered] = useState(!supported);
  const [visible, setVisible] = useState(!supported);

  useEffect(() => {
    const el = ref.current;
    if (!el || !supported) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setHasEntered(true);
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, supported]);

  return { ref, hasEntered, visible };
}
