/** A small, code-drawn straw-hat pirate emblem for the portfolio masthead. */
export function PirateMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="6" strokeLinecap="round">
        <path d="m20 74 61-49M19 26l62 49" />
        <path d="m16 72 8 8m-8-53 8-8m52 0 8 8m-8 53 8-8" />
      </g>
      <path d="M28 43c0-17 44-17 44 0v14c0 12-9 21-22 21S28 69 28 57Z" fill="#fff7e2" stroke="currentColor" strokeWidth="4" />
      <path d="M36 70v14c0 6 28 6 28 0V70" fill="#fff7e2" stroke="currentColor" strokeWidth="4" />
      <path d="M43 75v11m14-11v11M36 80h28" stroke="currentColor" strokeWidth="2.5" />
      <ellipse cx="39" cy="56" rx="7" ry="8" fill="currentColor" />
      <ellipse cx="61" cy="56" rx="7" ry="8" fill="currentColor" />
      <path d="m50 63-5 7h10Z" fill="currentColor" />
      <path d="M24 36C24 2 76 2 76 36" fill="#e9b949" stroke="currentColor" strokeWidth="4" />
      <path d="M24 27c14 5 38 5 52 0v10H24Z" fill="#c6402d" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="50" cy="38" rx="42" ry="8" fill="#e9b949" stroke="currentColor" strokeWidth="4" />
      <path d="m17 37 7 3m7-4 8 3m25-3 8 3m7-3 5 2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
