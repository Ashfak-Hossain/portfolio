import styles from './KatanaBlade.module.css';

interface KatanaBladeProps {
  /** Which sword this is — sets the pearl / cursed / haki colour theme. */
  aura: 'white' | 'cursed' | 'haki';
}

// Handle wrap (ito) diamonds — diagonal cross-hatch down the tsuka.
const WRAP_Y = [372, 392, 412, 432, 452, 472];

/**
 * A stylised vertical katana in paper-cut ink. Colours come entirely from
 * CSS custom properties (`--blade-*`) set by the aura class the parent passes,
 * so the same shape renders Wadō (pearl), Kitetsu (cursed red) or Enma (haki).
 * The blade lives in its own group whose transform-origin is the guard, so it
 * can be "drawn" upward out of the sheath (GSAP scaleY) for the iai reveal.
 */
export function KatanaBlade({ aura }: KatanaBladeProps) {
  return (
    <svg
      className={`${styles.katana} ${styles[aura]}`}
      viewBox="0 0 76 520"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <g filter="url(#skillInk)">
        {/* --- hilt (stays put while the blade draws) --- */}
        <g>
          {/* tsuka / handle */}
          <rect
            x="32"
            y="364"
            width="12"
            height="140"
            rx="4"
            fill="var(--handle-fill)"
            stroke="var(--blade-stroke)"
            strokeWidth="1.4"
          />
          {/* fuchi collar */}
          <rect x="31" y="362" width="14" height="7" rx="2" fill="var(--blade-stroke)" />
          {/* kashira pommel */}
          <rect x="30.5" y="498" width="15" height="9" rx="4" fill="var(--blade-stroke)" />
          {/* ito wrap diamonds */}
          <g stroke="var(--wrap-color)" strokeWidth="1.5" strokeLinecap="round" opacity="0.9">
            {WRAP_Y.map((y) => (
              <g key={y}>
                <line x1="32" y1={y} x2="44" y2={y + 16} />
                <line x1="44" y1={y} x2="32" y2={y + 16} />
              </g>
            ))}
          </g>
          {/* tsuba / guard */}
          <ellipse
            cx="38"
            cy="358"
            rx="23"
            ry="6.5"
            fill="var(--guard-fill)"
            stroke="var(--blade-stroke)"
            strokeWidth="1.4"
          />
          {/* seppa dot */}
          <circle cx="38" cy="358" r="2.4" fill="var(--blade-stroke)" />
        </g>

        {/* --- blade (draws upward out of the guard) --- */}
        <g className={styles.bladeBody} data-blade-body>
          {/* habaki collar */}
          <rect x="28" y="342" width="20" height="14" rx="2" fill="var(--blade-stroke)" />
          {/* blade — bolder, single-edged with a kissaki tip */}
          <path
            d="M45,16 C49,80 50,220 48,346 L27,352 C26,220 30,84 40,20 Z"
            fill="var(--blade-fill)"
            stroke="var(--blade-stroke)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {/* yokote (tip division) */}
          <line
            x1="41"
            y1="60"
            x2="49"
            y2="52"
            stroke="var(--blade-stroke)"
            strokeOpacity="0.5"
            strokeWidth="1"
          />
          {/* shinogi ridge line */}
          <path
            d="M47,40 Q49,190 46,344"
            fill="none"
            stroke="var(--blade-stroke)"
            strokeOpacity="0.38"
            strokeWidth="1"
          />
          {/* hamon temper line */}
          <path
            className={styles.hamon}
            d="M30,60 Q33,150 29,240 Q33,320 28,344"
            fill="none"
            stroke="var(--hamon-color)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
}
