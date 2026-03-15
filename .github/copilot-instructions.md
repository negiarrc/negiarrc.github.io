# Copilot Instructions

## Build, lint, and verification commands
- Install dependencies: `npm install`
- Local development: `npm run dev`
- Lint: `npm run lint`
- Production build: `npm run build`
- Full quality check (used in CI): `npm run check`
- Preview built site: `npm run preview`
- Tests: no test runner is configured in `package.json`, so there is currently no single-test command.

## High-level architecture
- This is a portfolio site built with Next.js App Router + React + TypeScript + Tailwind CSS and deployed to GitHub Pages.
- `src/app/layout.tsx` is the shared layout root (header/footer) for all pages, and route pages live under `src/app/**/page.tsx`.
- `src/app/page.tsx` is currently a client component that renders the top page sections and manages robot modal state.
- Content is data-driven:
  - `src/content/socialLinks.ts` defines SNS/site banner data, including `showInBanner` for banner/footer link visibility.
  - `src/content/robots.ts` defines robot card data.
  - `src/types/content.ts` defines shared content types.
- UI sections are split into focused components (`SocialBannerList`, `RobotGallery`, `ImageModal`).
- Theme behavior is CSS-driven in `src/app/globals.css`, with light variables in `:root` and dark variables under `@media (prefers-color-scheme: dark)`.
- Deployment is workflow-driven via `.github/workflows/deploy-pages.yml` (`main` push -> `npm run check` -> deploy `out` artifact).

## Repo-specific conventions
- Update portfolio content by editing `src/content/*.ts`; do not hardcode new items directly in components.
- Add robot images under `public/images/robots/` and reference them with absolute paths like `/images/robots/<file>`.
- Styling uses Tailwind utility classes plus CSS variables (`bg-[var(--bg)]`, `text-[var(--text)]`, etc.) rather than a custom Tailwind theme extension.
- Follow the project’s design constraints from README: simple UI with no gradients, no rounded corners, and no animations.
- For external links, keep `target="_blank"` with `rel="noopener noreferrer"` (as in `SocialBannerList`).
- Footer SNS links are rendered from the same social link config and displayed as `|`-separated service names.
- Keep Next.js static export settings in `next.config.ts` (`output: 'export'`, `trailingSlash: true`) for GitHub Pages compatibility.
- Define per-page titles via `export const metadata` in each `page.tsx`; keep shared title template/icons in `src/app/layout.tsx`.
