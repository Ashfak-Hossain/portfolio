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
        style={background ? { background } : undefined}
      />
    );
  }
  return (
    <div
      className={styles.placeholder}
      role="img"
      aria-label={alt || placeholder}
      style={background ? { background } : undefined}
    >
      {placeholder}
    </div>
  );
}
