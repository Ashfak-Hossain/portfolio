import styles from './ImageSlot.module.css';

interface ImageSlotProps {
  src: string | null;
  alt?: string;
  placeholder?: string;
  background?: string;
}

export function ImageSlot({
  src,
  alt = '',
  placeholder = '// drop image',
  background,
}: ImageSlotProps) {
  if (src) {
    return (
      <img
        className={styles.img}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={background ? { background } : undefined}
      />
    );
  }
  // No real image: if there's no meaningful alt, keep the "// drop …" dev
  // scaffolding out of the accessibility tree instead of announcing it.
  return (
    <div
      className={styles.placeholder}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      style={background ? { background } : undefined}
    >
      {placeholder}
    </div>
  );
}
