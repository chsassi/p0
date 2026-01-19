[Visit](www.protocolzero.online)
<img width="3804" height="2176" alt="image" src="https://github.com/user-attachments/assets/0092478b-afde-4367-9e71-21e891d18df1" />
<img width="3804" height="2176" alt="image" src="https://github.com/user-attachments/assets/de206240-7b85-4ffb-9fb8-a5abdab44901" />
<img width="3804" height="2176" alt="image" src="https://github.com/user-attachments/assets/31397355-f7df-4673-9b09-c1b0e5bfecca" />

## Overview

Protocol Zero is a static informational website built with Astro for a european neurofunk label. 

It provides:
- A homepage with featured sections and highlights.
- Pages listing artists and individual artist detail pages.
- Pages listing releases and individual release detail pages.
- Shop and contact sections.

Dynamic content is driven by JSON files in `src/data/` for simplicity and easy editing.

## Setup and local development

Prerequisites:
- Node.js
- npm

Main commands:
- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Production build: `npm run build`
- Preview build: `npm run preview`


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
- Framework: Astro
- Languages: TypeScript, HTML, CSS
- Assets: `public/` directory

Code organization:
- `src/pages/` contains Astro pages that generate static routes.
- `src/layouts/` contains reusable layouts.
- `src/data/` contains JSON files which serve as the content source.

## Build System (Extended/Compact)

The project uses a custom build system that separates **extended** (readable/debug) source files from **compact** (minified/production) output files.

### Directory Structure

```
src/
├── styles/                    # Extended CSS (readable, formatted)
│   ├── global.extended.css
│   ├── header.extended.css
│   ├── home.extended.css
│   ├── pages.extended.css
│   ├── artists.extended.css
│   └── releases.extended.css
│
└── scripts/                   # Extended TypeScript (readable)
    ├── index-slideshow.extended.ts
    ├── index-loader.extended.ts
    ├── header-menu.extended.ts
    └── footer-scramble.extended.ts

public/
├── styles/                    # Compact CSS (auto-generated, minified)
└── scripts/                   # Compact JS (auto-generated, minified)

scripts/                       # Build tools
├── build-styles.js            # CSS: extended → compact
├── build-scripts.js           # TS: extended → compact
└── watch.js                   # File watcher for auto-rebuild
```

### NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Runs Astro dev server + watch mode in parallel |
| `npm run build` | Builds styles + scripts, then runs Astro build |
| `npm run build:styles` | Minifies extended CSS to compact |
| `npm run build:scripts` | Transpiles/minifies TS to compact JS |
| `npm run init:styles` | Creates extended CSS from existing compact |
| `npm run init:scripts` | Extracts inline scripts to extended format |
