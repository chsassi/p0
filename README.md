# Protocol Zero

<img width="3804" height="2176" alt="image" src="https://github.com/user-attachments/assets/0092478b-afde-4367-9e71-21e891d18df1" />

## Project Overview

`Protocol Zero` is a static informational website built with Astro. It provides:

- A homepage with featured sections and highlights.
- Pages listing artists and individual artist detail pages.
- Pages listing releases and individual release detail pages.
- Shop and contact sections.

Dynamic content is driven by JSON files in `src/data/` for simplicity and easy editing.

## Setup and local development

Prerequisites:

- Node.js (LTS recommended)
- npm (or yarn/pnpm if preferred)

Main commands:

- Install dependencies: `npm install`
- Start development server: `npm run dev` (Astro runs the dev server)
- Production build: `npm run build`
- Preview build: `npm run preview`

Useful tools:

- Editor: VS Code with Astro and Prettier extensions
- Version control: Git

## Site usage and content

Main pages:

- `index.astro` — homepage with previews and links to main sections.
- `artists.astro` and `artists/[artist].astro` — artists list and detail pages.
- `releases.astro` and `releases/[release].astro` — releases list and detail pages.
- `about.astro`, `contacts.astro`, `shop.astro` — informational pages.

Content and data:

Primary content (artists, releases, news) is stored as JSON in `src/data/`. Updating those files will be reflected on the site after the next build.

Images and asset handling:

Place static files in `public/` (e.g., `public/images/`, `public/videos/`). Reference them from pages using paths under `/images/...`.

## Architecture and technical structure

Stack:

- Framework: Astro (static site generator)
- Languages: TypeScript, HTML, CSS
- Assets: `public/` directory

Code organization:

- `src/pages/` contains Astro pages that generate static routes.
- `src/layouts/` contains reusable layouts.
- `src/data/` contains JSON files which serve as the content source.

Routing:

Astro maps files in `src/pages/` to corresponding routes; folders with placeholders like `[artist].astro` produce dynamic pages based on data.

Build:

Astro compiles static pages during `build`. Components and templates are prerendered.

## Data and JSON format

Main data files are located in `src/data/`:

- `artists.json` — list of artists with fields like `id`, `name`, `bio`, `image`, `social`.
- `releases.json` — list of releases with `id`, `title`, `artistId`, `date`, `cover`, `links`.
- `news.json` — news and updates.

Guidelines:

- Use unique `id` values to link releases to artists via `artistId`.
- Keep image paths consistent with `public/images/`.
- Validate JSON before committing (e.g., with `jq` or your editor's JSON extension).

## Deployment

Configuration file:

- `vercel.json` is present for deploying to Vercel (routing/build specific settings).

Recommended hosting options:

- Vercel: native integration with Astro projects, automatic deploys from GitHub.
- Netlify: good support for static sites.

Procedure (example: Vercel):

1. Connect the repository to Vercel.
2. Set the build command to: `npm run build`.
3. Configure the output directory (commonly `.astro/dist` or as set by Astro).

Note: check `astro.config.mjs` for any adapter-specific settings.

## Contributing guidelines

1. Fork the repository and create a branch for your feature/bugfix (e.g., `feature/your-feature`).
2. Follow the existing code style; use Prettier if configured.
3. Update `src/data/` when adding artists or releases, keeping JSON format consistent.
4. Open a Pull Request with a clear description of changes.

Review:

- PRs will be reviewed; include screenshots or example data when relevant.
# Protocol Zero

Static website repository for "Protocol Zero", built with Astro.

## Summary

- Purpose: a showcase site featuring artists, releases, videos, and a shop.
- Technologies: Astro, TypeScript, HTML, CSS.
- Data: JSON files located in `src/data/` (artists.json, releases.json, news.json).

## Usage

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
npm run preview
```
