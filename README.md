# Aditya Kumawat — Developer Portfolio

A mobile-first developer portfolio built with Next.js, React and Tailwind CSS.

## Project rules

- Components and pages use JSX/JavaScript.
- Tailwind CSS handles component, layout and responsive styling.
- `src/app/globals.css` is intentionally small and only contains theme tokens, document-level defaults, loader keyframes and the complex Hero media blend.
- Content lives in `src/data/portfolio.js` for now. A backend/admin can replace the data source later without rewriting the UI.
- Mobile and tablet use the static Hero poster. Fine-pointer desktop devices load the interactive scrub video.
- The navbar highlights the section currently in view.

## Run

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Main files

- `src/app/layout.jsx` — root layout, metadata and saved theme bootstrap
- `src/app/(public)/page.jsx` — public home page
- `src/app/globals.css` — global-only CSS
- `src/components/layout/Navbar.jsx` — floating navbar + scroll-spy
- `src/components/sections/Hero.jsx` — Hero section layout
- `src/components/hero/HeroBackground.jsx` — poster/video media layer
- `src/components/hero/HeroContent.jsx` — Hero copy and CTAs
- `src/components/sections/About.jsx` — About section
- `src/data/portfolio.js` — editable frontend content
- `src/hooks/useVideoScrub.js` — desktop video scrub logic

Backend/admin work should begin only after the frontend sections are complete and visually approved.
