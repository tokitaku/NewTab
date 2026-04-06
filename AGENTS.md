# AGENTS.md

## Purpose

This repository is a small Next.js Pages Router app that serves as a custom browser new tab page and is deployed as a static export.

When making changes, optimize for:

- keeping the app lightweight
- preserving static export compatibility
- avoiding unnecessary architectural churn

## Project Shape

- `src/pages/index.tsx`: main new tab page UI with the background image, search form, clock, and pomodoro timer
- `src/pages/_app.tsx` and `src/pages/_document.tsx`: Pages Router app/document wrappers
- `src/components/Clock.tsx`: live clock and date display
- `src/components/PomodoroTimer.tsx`: browser-side pomodoro timer with Notification API and Web Audio usage
- `src/components/LinkButton.tsx`: link button UI component; confirm it is still needed before expanding its usage
- `src/styles/`: global styles and page-level CSS modules
- `src/useTime.tsx`: small client-side hook used by the clock
- `src/utils/config.ts`: `getUrl(...)` helper that reads `publicRuntimeConfig.urlPrefix` for prefixed asset paths
- `public/images/`: source image assets
- `public/favicon.ico`: favicon asset, though the main page currently points at an image-based icon path via `getUrl(...)`
- `out/`: generated static export output

## Working Rules

- Prefer small, local edits over large refactors.
- Follow existing Next.js Pages Router patterns used in `src/pages/`.
- Keep browser-side behavior simple; this project is primarily a static client page.
- Preserve compatibility with `basePath`, `assetPrefix`, and `publicRuntimeConfig.urlPrefix` from `next.config.js`.
- When referencing static assets in page code, prefer the existing `getUrl(...)` helper rather than hardcoding deployment-specific paths.
- Be careful with browser-only APIs such as `Notification`, `AudioContext`, and `document.location`; keep SSR/static export behavior safe.

## Do Not Edit Directly

- `out/`: generated build output
- `.next/`: local Next.js build cache
- `node_modules/`: installed dependencies
- generated optimized image artifacts under `public/images/nextImageExportOptimizer/` unless the task is specifically about image generation or optimization output

## Development Commands

- `npm run dev`: start local development server
- `npm run lint`: run lint checks
- `npm run build`: build and export the static site
- `npm run export`: export the already-built app
- `npm run serve`: build and serve the exported `out/` directory
- `npm run start`: run the Next.js production server; useful for Next itself, but deployment here targets static export

## Validation

For code changes, run:

1. `npm run lint`
2. `npm run build`

If the change affects asset paths, deployment paths, or exported output behavior, pay extra attention to:

- `next.config.js`
- any `getUrl(...)` usage
- image and icon references in `src/pages/index.tsx`
- notification icon or other hardcoded asset paths in `src/components/PomodoroTimer.tsx`

## Change Guidance

- UI changes should stay consistent with the existing visual direction unless the task explicitly asks for redesign.
- Asset changes should prefer updating source files in `public/images/`.
- Keep TypeScript and React code straightforward; avoid introducing abstractions that are not clearly justified by repeated use.
- If adding new functionality, place it in the smallest sensible component, hook, or utility rather than expanding `index.tsx` unnecessarily.
- Keep the main page simple: it is currently a single-screen client UI centered around the clock, search input, and pomodoro timer.

## Notes For Agents

- This project currently uses Next.js `13.1.x` with the Pages Router, not the App Router.
- Static export matters here; avoid features that require a server runtime.
- `URL_PREFIX` is wired through `next.config.js` into `basePath`, `assetPrefix`, and `publicRuntimeConfig.urlPrefix`.
- Check whether a path-related change also needs to work under `URL_PREFIX`, especially for favicon, background, and notification/icon asset references.
