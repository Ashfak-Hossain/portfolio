import type { PanelArt } from '../../types/content';

/** `src` with `{w}` → a width-descriptor srcset; a single file → none. */
function srcSet(art: PanelArt): string | undefined {
  if (!art.widths?.length) return undefined;
  return art.widths.map((w) => `${art.src.replace('{w}', String(w))} ${w}w`).join(', ');
}

function fallbackSrc(art: PanelArt): string {
  return art.widths?.length ? art.src.replace('{w}', String(art.widths[0])) : art.src;
}

interface MangaPictureProps {
  art: PanelArt;
  /** Optional art-directed crop for narrow screens (a different framing, not just a smaller file). */
  narrow?: PanelArt;
  /** Media query under which `narrow` is used. */
  narrowMedia?: string;
  alt: string;
  /** Rendered width hints for the browser's srcset choice. */
  sizes: string;
  className?: string;
}

/**
 * Responsive panel art. Screentone has to be shown near its native size —
 * shrinking a dot pattern a lot makes moiré — so each width of a manga
 * image is rendered with the same number of dots and the browser picks
 * the closest one.
 */
export function MangaPicture({
  art,
  narrow,
  narrowMedia = '(max-width: 700px)',
  alt,
  sizes,
  className,
}: MangaPictureProps) {
  return (
    <picture>
      {narrow && (
        <source media={narrowMedia} srcSet={srcSet(narrow) ?? narrow.src} sizes={sizes} />
      )}
      <img
        className={className}
        src={fallbackSrc(art)}
        srcSet={srcSet(art)}
        sizes={sizes}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}
