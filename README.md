# Ashfak Hossain Evan — Portfolio

- **Stack:** React
- **Animation:** [GSAP](https://gsap.com) + ScrollTrigger (scroll cinematics, ScrambleText headline)
- **3D:** [three.js](https://threejs.org) + [React Three Fiber](https://r3f.docs.pmnd.rs)
- **Smooth scroll:** [Lenis](https://lenis.darkroom.engineering)
- **Look:** locked to the design's _Ink & Bone_ palette / _Zoro Green_ accent; all heavy motion calms under `prefers-reduced-motion` (the 3D scene falls back to a static SVG katana)

## Architecture

```
src/
  main.tsx                     React root
  App.tsx                      composition root: Lenis + section order
  index.css                    imports tokens + global base

  styles/
    tokens.css                 design tokens (colors, fonts, spacing, z-index) — change here
    global.css                 reset, ambient keyframes, reduced-motion

  types/                       content + motion type contracts
  content/                     ← EDIT THIS: one typed file per section, re-exported from index.ts
  lib/
    gsap.ts                    registers GSAP plugins once; re-exports gsap/ScrollTrigger/useGSAP
    motion.ts                  Cinematic / Subtle motion profiles
  hooks/
    useReducedMotion, useMotion            resolve the motion profile
    useScramble, usePointerParallax        hero effects
    useMagnetic, useLenis                  magnetic hover, smooth scroll
  components/
    layout/     Nav, Footer, ScrollProgress
    ui/         Reveal, Eyebrow, StatCounter, ImageSlot, WantedPoster, ProjectCard
    sections/   Hero, DonDivider, About, Work, OneCut, Connect, Contact
    three/      KatanaScene (lazy), Katana, Sparks, KatanaFallback, textures
```

Each component owns a co-located `*.module.css`. Animations are React hooks built on
GSAP; ambient decorative loops (halftone drift, concentration lines) are plain CSS so
`prefers-reduced-motion` can stop them. The `@` alias maps to `src/`.

## Editing content

Everything editable lives in **`src/content/`** — one typed file per section. Items
marked `TODO` are placeholders drafted from the original design; confirm or replace them.

| What                                             | File          |
| ------------------------------------------------ | ------------- |
| Name, katakana, edition                          | `identity.ts` |
| Hero lede / bio                                  | `hero.ts`     |
| About copy + quote                               | `about.ts`    |
| Bounty poster (name, role, bounty)               | `poster.ts`   |
| **Stats** (CF rating, problems, contests, years) | `stats.ts`    |
| **Projects** (6)                                 | `work.ts`     |
| One-cut section copy                             | `oneCut.ts`   |
| Blog + social links                              | `connect.ts`  |
| Contact copy + form endpoint                     | `contact.ts`  |

### Images

Image slots show a `// drop …` placeholder until you give them a real image:

1. Put files in `src/assets/` (create the folder).
2. Import and reference:
   - **Portrait:** `import portrait from '../assets/portrait.jpg'` → set `poster.portrait = portrait`.
   - **Project screenshots:** import each and set that project's `image`.

### The "One cut" 3D katana

`components/three/` holds the WebGL scene. The katana is built from primitives in
`Katana.tsx`; the cut choreography + sparks are in `KatanaScene.tsx`. It's lazy-loaded
and swapped for a static SVG (`KatanaFallback.tsx`) under reduced motion. To restyle,
edit the materials/colors there (violet tokens live in `styles/tokens.css`).

### Making the contact form live

The form is **decorative** (validates + shows the success state, sends nothing). Set
`contact.endpoint` to a Formspree/Getform URL and POST to it in
`components/sections/Contact.tsx`.

## Deploy (Vercel)

Zero-config — Vercel detects Vite automatically.

```bash
npm i -g vercel
vercel            # preview
vercel --prod     # production
```

Build output is static, so Netlify / Cloudflare Pages / GitHub Pages work too (for a
GitHub Pages subpath, set `base: '/<repo>/'` in `vite.config.ts`).

---

The previous plain-JS implementation is preserved in `old/` and can be deleted once
you're happy with this version.
