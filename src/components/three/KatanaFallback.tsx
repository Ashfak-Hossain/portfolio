/**
 * Static, WebGL-free katana shown under reduced motion (and while the 3D scene
 * lazy-loads). Keeps the section meaningful without any animation.
 */
export function KatanaFallback() {
  return (
    <svg
      viewBox="0 0 400 620"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="kf-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3e8ff" />
          <stop offset="0.5" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <filter id="kf-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g transform="rotate(-14 200 310)" filter="url(#kf-glow)">
        {/* blade */}
        <polygon
          points="196,90 210,96 210,430 200,470 190,430"
          fill="#221a38"
          stroke="#4c2f8f"
          strokeWidth="1.5"
        />
        {/* glowing edge */}
        <line
          x1="196"
          y1="92"
          x2="196"
          y2="452"
          stroke="url(#kf-edge)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* guard */}
        <rect x="176" y="430" width="48" height="8" rx="3" fill="#17121f" />
        {/* handle */}
        <rect x="192" y="438" width="16" height="96" rx="6" fill="#0f0b17" />
        <rect x="190" y="530" width="20" height="10" rx="3" fill="#17121f" />
      </g>
    </svg>
  );
}
