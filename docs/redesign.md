# The Grand Line Chronicles

The portfolio is presented as a five-chapter One Piece manga volume. The cover features original Luffy, Zoro, and Thousand Sunny fan art, with bold comic lettering, black panel gutters, halftone shading, and gold, red, and green accents. Pirate emblems, a torn bounty poster, sword-attack panels, Japanese sound effects, and a nautical logbook carry the theme through the page. The cover has a reversible Haki interaction.

## Preview and verify

```sh
npm run dev
npm run lint
npm run build
```

Vite serves the local preview. The production build remains a static Vite application for the existing Vercel configuration. No new runtime dependencies were added.

## Chapters

| Chapter | Purpose | Content |
| --- | --- | --- |
| Cover | Introduce the engineer and visual identity | Name, role, work and résumé links, original One Piece fan art, interactive Haki release |
| 01 — The backstory | Show the person behind the work | Portrait, wanted-poster treatment, biography, existing competitive-programming statistics |
| 02 — Selected arcs | Make the engineering easy to explore | Shortn, noOverlap, Echo & Aura, direct links, expandable system notes |
| 03 — The armory | Present technical range | Three existing SVG swords and grouped skills |
| 04 — Field notes | Connect to writing and public profiles | Illustrated logbook, blog, GitHub, Codeforces, LinkedIn, résumé |
| 05 — The next chapter | Start a conversation | Letter-style form, direct email, copy-email button |

## Editing

- `src/content/edition.ts`: cover, navigation, field-notes and contact presentation copy.
- `src/content/mangaChapters.ts`: biography and armory labels.
- `src/content/work.ts`: project descriptions, URLs and engineering notes.
- `src/styles/tokens.css`: shared palette, typefaces and spacing.
- Co-located CSS Modules: chapter-specific layouts and responsive behavior.
- `public/assets/grand-line-cover.webp`: optimized fan art used by the cover. See [the complete generation prompt](grand-line-art.md) for regeneration details.

The two restored project entries came from portfolio revision `3842402` and were confirmed by the owner. The noOverlap README and Echo & Aura architecture link were subsequently read through GitHub. Unverified historical benchmark figures are not displayed.

## Interaction and accessibility

The Haki release is a keyboard-operable button with `aria-pressed` and a live status. Pointer tilt is decorative. Mobile navigation closes on selection and Escape, and its contents can scroll in a short viewport. Project details use native disclosure controls.

Motion honors `prefers-reduced-motion`, including changes while the page is open. GSAP contexts revert before dependent effects rebuild, pointer-created tweens are context-managed, and Lenis is disabled for reduced motion. Chapter navigation works through ordinary fragment links. Native focus indicators remain visible on both paper and ink backgrounds.

The contact form preserves `/api/contact` and its existing server-side mail configuration. It only displays success after a successful JSON response containing `ok: true`. A direct email link remains available if the request fails. Input limits match the existing server handler.

## Verification record

- `npm run build`: passed (TypeScript and Vite production build).
- `npm run lint`: passed.
- `git diff --check`: passed.
- Server-render smoke check: one h1, unique IDs, all three projects and disclosures, valid internal anchors, existing local image and résumé assets.
- Source review: reduced-motion cleanup, mobile-menu sizing, focus contrast, and interaction semantics reviewed and corrected.

No browser was connected to the session, so desktop/mobile screenshot inspection and interactive browser testing remain unverified. A live email was not sent. No deployment or Git commit was made.
