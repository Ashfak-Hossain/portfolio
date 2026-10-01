/**
 * Shared SVG filters, rendered once at the app root and referenced from CSS
 * as `filter: url(#ink-rough)`.
 *
 * ink-rough: a straight CSS border pushed around by low-frequency noise, so
 * panel borders wobble like a pen line instead of looking ruled. Applied only
 * to the border layer (::after), never to text or art, which stay crisp.
 */
export function InkDefs() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: 'absolute' }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id="ink-rough" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="3.5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
