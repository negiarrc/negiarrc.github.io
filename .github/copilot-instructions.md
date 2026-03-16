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
- `src/app/layout.tsx` is the shared layout root (header/footer) for all pages and builds header nav items from `listHeaderNavigationPages()`.
- Fixed site pages are authored in `content/pages/**/*.mdx` and rendered by `src/app/[[...slug]]/page.tsx`.
- Site page URL mapping is file-structure based: `index.mdx` maps to the directory root, and non-`index` file names become the last URL segment.
- Article detail pages are served by `src/app/articles/[category]/[slug]/page.tsx` at `/articles/<category>/<slug>`.
- Category summary pages are served by `src/app/categories/[category]/page.tsx` at `/categories/<category>`.
- Content is data-driven:
  - `src/content/socialLinks.ts` defines SNS/site banner data, including `showInBanner` for banner/footer link visibility.
  - `content/pages/**/*.mdx` stores fixed page content and page frontmatter.
  - `src/lib/pages/frontmatter.ts` + `src/lib/pages/loader.ts` parse/validate site-page metadata and build header navigation candidates.
  - `content/articles/<category>/<slug>.mdx` stores article content and frontmatter.
  - `src/lib/articles/loader.ts` + `src/lib/articles/frontmatter.ts` load and validate article metadata.
- Shared MDX components are managed in `src/mdx-components.tsx`. Prefer `ArticleListBlock` for article listings (`category?: string`, `variant?: 'card' | 'text'`, `emptyMessage?: string`), and use `SocialBannerBlock` for SNS links.
- Legacy wrappers `RoboconArticleCardsBlock` / `AllArticlesTextListBlock` remain for compatibility, but new MDX should prefer `ArticleListBlock`.
- UI sections are split into focused components (`HeaderNavigation`, `SocialBannerList`, `TagArticleList`).
- Theme behavior is CSS-driven in `src/app/globals.css`, with light variables in `:root` and dark variables under `@media (prefers-color-scheme: dark)`.
- Tailwind setup targets v4.2: load Tailwind in `src/app/globals.css` via `@import "tailwindcss";` and use `@tailwindcss/postcss` in `postcss.config.js`.
- Deployment is workflow-driven via `.github/workflows/deploy-pages.yml` (`main` push -> `npm run check` -> deploy `out` artifact).

## Repo-specific conventions
- Update portfolio content in source content files (`content/pages/**/*.mdx`, `content/articles/**/*.mdx`, `src/content/socialLinks.ts`); do not hardcode page content in components.
- Site page frontmatter: required `title`; optional `description`, `navLabel`, `showInHeader`, `navOrder`.
- To show a site page in the header, set `showInHeader: true`. Header label uses `navLabel` if present, otherwise `title`.
- Header order is `navOrder` ascending, then fallback sort by `pathname` and `title`.
- Site page paths are derived from file paths under `content/pages`: `.../index.mdx` maps to directory root; non-`index` file names become URL segments.
- For article files, keep `category` aligned with directory name and `slug` aligned with file name.
- Article detail pages must remain addressable at `/articles/<category>/<slug>`.
- Category summary routes are statically generated from existing article frontmatter `category` values (`listAllArticlesMetadata()`); unknown categories should resolve to 404.
- Required article frontmatter fields: `title`, `thumbnail`, `publishedAt`, `excerpt`, `category`, `slug`.
- In site-page MDX, prefer `ArticleListBlock` for article listings:
  - Robocon cards: `<ArticleListBlock category="robocon" />`
  - All articles text list: `<ArticleListBlock variant="text" />` (`category` omitted means all)
  - Use `emptyMessage` when custom empty-state text is needed.
- `RoboconArticleCardsBlock` / `AllArticlesTextListBlock` are compatibility-oriented wrappers; avoid adding new usage unless needed for existing content compatibility.
- The homepage robocon section is driven by `listArticlesMetadataByCategory("robocon")`; categorize relevant articles as `robocon` to show them there.
- Add robot images under `public/images/robots/` and reference them with absolute paths like `/images/robots/<file>`.
- Styling uses Tailwind utility classes plus CSS variables (`bg-[var(--bg)]`, `text-[var(--text)]`, etc.) rather than a custom Tailwind theme extension.
- Keep Tailwind config in v4.2 style; do not reintroduce legacy v3 directives (`@tailwind base/components/utilities`) or `tailwindcss` PostCSS plugin wiring.
- Follow the project’s design constraints from README: simple UI with no gradients, no rounded corners, and no animations.
- For external links, keep `target="_blank"` with `rel="noopener noreferrer"` (as in `SocialBannerList`).
- Footer SNS links are rendered from the same social link config and displayed as `|`-separated service names.
- Keep Next.js static export settings in `next.config.ts` (`output: 'export'`, `trailingSlash: true`) for GitHub Pages compatibility.
- Keep shared title template/icons in `src/app/layout.tsx`; for fixed pages, set title/description in `content/pages` frontmatter.
