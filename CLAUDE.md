# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Single-page, cinematic portfolio for Ashfak Hossain Evan ("Portfolio Vol.26 — Manga
Edition"). React 19 + TypeScript (strict) + Vite 8, driven entirely by GSAP scroll
animation over pure SVG/CSS — no WebGL/three.js in the shipped bundle.

## Commands

```bash
npm run dev        # Vite dev server (default :5173)
npm run build      # tsc -b && vite build  →  dist/
npm run lint       # eslint (flat config, typescript-eslint + react-hooks + react-refresh)
npm run preview    # serve the production build
```

There is **no test suite** — verification is `npm run build` (which typechecks via
`tsc -b`) plus `npm run lint`. Both must stay green.

## Architecture

`App.tsx` is the composition root: it turns on Lenis smooth scroll via
`useLenis(smoothScroll)` and renders the sections in fixed order (Hero → InkImpact →
About → Work → Skills → Connect → Contact) inside `<main>`, with Nav/Footer/ScrollProgress
around it. There is no router — anchors (`#about`, `#work`, `#skills`, `#connect`,
`#contact`, `#top`) scroll within the page. Note the Nav labels the `#connect` link
"Blog" — the Connect section _is_ the blog/links section.

Three cross-cutting systems matter more than any single component:

**1. Content is fully separated from presentation.** All editable copy/data lives in
`src/content/*.ts` (one file per section, re-exported from `src/content/index.ts`), typed
against `src/types/content.ts`. Components import data from `../../content` and never
hardcode strings. Values marked `TODO` are design placeholders. To change what the site
_says_, edit `content/`; to change how it _looks/moves_, edit the component + its CSS
module.

**2. Motion is centrally resolved and always reduced-motion-aware.** `useMotion()`
(hooks/useMotion.ts) returns a `MotionProfile` — `CINEMATIC` or `SUBTLE` — derived from
`useReducedMotion()` (a `useSyncExternalStore` over `prefers-reduced-motion`). Profiles
are defined in `lib/motion.ts`. **Every animated component reads `reduced` (or a profile
field) and must provide an instant/static branch** — GSAP tweens become `gsap.set`,
scramble/parallax become no-ops, and Lenis is off (native scroll). Because every
ScrollTrigger lives only in the non-reduced path, `useLenis` is also where triggers are
`ScrollTrigger.refresh()`-ed once Lenis is live and again on `document.fonts.ready` — the
deferred web fonts shift layout after the triggers are first measured, and without the
refresh the lowest reveals (Blog/Contact) would stay stuck at `opacity:0`. When adding
animation, follow this pattern.

**3. GSAP has one registration point.** Always import `gsap`, `ScrollTrigger`, and
`useGSAP` from `src/lib/gsap.ts` (never directly from `gsap`/`@gsap/react`) — that module
is the only place `registerPlugin` runs (ScrollTrigger + ScrambleText + useGSAP).
Animations are React hooks/components built on `useGSAP({ scope, dependencies })`, which
handles cleanup and StrictMode double-invoke. Reusable effects live in `hooks/`
(`useScramble`, `usePointerParallax`, `useMagnetic`) and primitives in `components/ui/`
(`Reveal`, `StatCounter`). Purely decorative infinite loops (halftone drift, concentration
lines, aura pulse) are **CSS keyframes** in `styles/global.css`, marked with the
`data-ambient` attribute so the reduced-motion CSS block can stop them.

### The Skills section (`sections/Skills.tsx`)

The katana centerpiece is now pure SVG/CSS/GSAP (no WebGL). `Skills.tsx` draws three
named blades (`components/ui/KatanaBlade.tsx`) on a single scroll-triggered timeline
(`start: 'top 68%', once: true`) — an opening slash + sparks, an _iai_ blade draw, the
text/skill chips, a Conqueror's-haki crackle, and a faint Ashura nine-blade ghost. It is
fully reduced-motion aware: the `reduced` branch `gsap.set`s every element to its final
state and skips the timeline.

### Styling

CSS Modules co-located with each component (`Foo.module.css`). The locked visual system
(Ink & Bone palette, Zoro-Green accent, haki violets, fonts, spacing, z-index) is defined
once as CSS custom properties in `src/styles/tokens.css` — change tokens there, not in
components. `styles/global.css` holds the reset, ambient keyframes, and the
`prefers-reduced-motion` overrides. `index.css` just `@import`s both. Fonts load via
`<link>` in `index.html`. Path alias `@` → `src`.

## TypeScript / lint constraints (strict template)

- `verbatimModuleSyntax` is on → import types with `import type { … }`. Type-only value
  imports fail the build.
- `erasableSyntaxOnly` → no enums or namespaces; use union string literals + `as const`.
- No `React.X` namespace references (new JSX transform, React isn't imported) — import the
  type instead (e.g. `import type { RefObject } from 'react'`).
- `react-refresh/only-export-components`: component files (`.tsx`) should export only
  components. Keep data in `content/`, hooks in `hooks/`, types in `types/`.

## `old/`

`old/` is the previous plain-JS implementation, kept for reference and slated for
deletion. It is excluded from the build/typecheck (`tsconfig` includes only `src`) and
from lint (only `**/*.{ts,tsx}` are linted). Do not import from it or spend effort on it.

## Deploy

Static build; Vercel is the target (zero-config Vite detection). For a GitHub Pages
subpath, set `base: '/<repo>/'` in `vite.config.ts`. See `README.md` for the content-swap
guide, image workflow, and how to make the (currently decorative) contact form live.
