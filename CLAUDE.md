# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

ZAKARIA is a premium Greek olive oil brand website — a single-page marketing site with luxury aesthetics (gold/cream/olive palette, serif fonts, canvas animations). The app lives entirely in `app/`.

## Commands

All commands run from the `app/` directory:

```bash
npm run dev      # Dev server on port 3000 (HMR enabled)
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint across entire project
npm run preview  # Serve the production build locally
```

There is no test suite configured.

## Architecture

**Entry point:** `index.html` → `src/main.tsx` → `src/App.tsx`

**App.tsx** is the root component. It owns two cross-cutting concerns:
1. **Lenis smooth scroll** — initialized once, stopped while the preloader is active, started on completion
2. **GSAP + ScrollTrigger** — registered globally; individual sections create their own timelines

**Page structure** (rendered in order by `App.tsx`):
- `src/sections/Preloader.tsx` — canvas-based oil-droplet loading animation; calls `onComplete` when done, which sets `isLoading = false` and starts Lenis
- `src/sections/Navigation.tsx` — fixed header; changes style on scroll
- `src/sections/Hero.tsx` — fullscreen canvas particle animation; receives `isLoading` to defer its reveal
- `src/sections/Origin.tsx`, `Products.tsx`, `Quality.tsx`, `Philosophy.tsx` — content sections with GSAP scroll-triggered animations
- `src/sections/Footer.tsx`
- `src/components/ScrollProgress.tsx` — fixed gold progress bar at top of viewport

**`src/pages/Home.tsx`** is an unused scaffold left over from project initialization — it is not rendered anywhere.

## Styling

- Tailwind CSS v3 with the shadcn "new-york" theme
- Custom color palette `zakaria` (gold/cream/olive tones) defined in `tailwind.config.js`
- Fonts: Playfair Display (display), Inter (body), Cormorant Garamond (accent)
- Global CSS in `src/index.css`; component-specific overrides in `src/App.css`

## UI components

40+ pre-installed shadcn/ui components live in `src/components/ui/`. Import via the `@/` alias:

```ts
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
```

The `@/` alias maps to `./src` (configured in both `vite.config.ts` and `tsconfig.app.json`).

## Animation patterns

- **GSAP ScrollTrigger:** sections call `gsap.timeline({ scrollTrigger: { ... } })` in a `useEffect`. Always kill the timeline in the cleanup function to avoid memory leaks across HMR reloads.
- **Canvas animations:** Preloader and Hero render directly to `<canvas>` using `requestAnimationFrame` loops managed in `useEffect`. Cancel the animation frame in cleanup.
- **Lenis integration:** Lenis RAF is driven by `gsap.ticker`, not its own loop. Do not create a separate `requestAnimationFrame` for Lenis.
