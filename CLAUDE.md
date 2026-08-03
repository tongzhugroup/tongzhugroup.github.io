# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Source for the Tong Zhu Research Group website at **computchem.cn**, built with **Hexo 7.3** + the **NexT** theme (v8.27) and deployed to GitHub Pages via a GitHub Actions workflow on push to `master`. There is no test suite — validation is `yarn build` succeeding.

## Common commands

```bash
yarn install          # runs patch-package postinstall (applies patches/hexo-tag-publications+0.3.8.patch)
yarn server           # local dev server at http://localhost:4000 (hexo server)
yarn build            # hexo generate -> public/  (CI runs this)
yarn clean            # hexo clean (clears public/, db.json, .deploy*)
yarn deploy           # hexo deploy (not used — deployment is via Actions, see below)
```

Node 22 (matches the Actions workflow). Package manager is **yarn** with `nodeLinker: node-modules` (`.yarnrc.yml`); there is a committed `yarn.lock`.

## Deployment

`.github/workflows/push.yml` builds on every push to `master` and on PRs, and deploys the `public/` artifact to GitHub Pages **only on push to `master`** (tag pushes `v*` also trigger builds). Do not run `yarn deploy` — there is no `deploy:` config and Pages is driven by Actions.

## Architecture

### Two config files
- `_config.yml` — Hexo site config (URL `https://computchem.cn`, permalink `:year/:month/:day/:title/`, timezone `Asia/Shanghai`). Notable: `hexo-all-minifier: true`, `cdn.use_webp: true` with `max_width` responsive image breakpoints, `marked.lazyload: true`, sitemap generation enabled. `skip_render: 404.html`.
- `_config.next.yml` — NexT theme overrides. Scheme `Muse`, custom files pointed at `source/_data/styles.styl` and `source/_data/footer.njk` (footer + sidebar share `footer.njk`). Menu drives the top nav (HOME / TEAM / RESEARCH / PUBLICATIONS / SOFTWARES / TEACHING / MEMORY / GROUP SEMINAR / TIPS). MathJax enabled; TOC disabled; sidebar hidden; `motion` (animation) off.

### `scripts/` — Hexo extensions loaded at boot
These are plain JS files Hexo auto-loads; they register injectors/filters that customize the theme:
- `bootstrap.js` — injects Bootstrap grid CSS (`bootstrap-grid.min.css`) at `head_end` via the `unpkg_url` helper to load version-matched CDN URLs.
- `header.js` — registers a `theme_inject` filter that injects `source/_data/header.njk` as a header image. `imgid(page)` deterministically hashes `page.path` (sha256 mod 5 + 1) to pick a header image variant per page.
- `jsdelivr.js` — on `generateBefore`, rewrites theme asset URLs (NexT images, `@njzjz/icons` favicon/avatar) to jsDelivr CDN URLs. On `after_generate`, **removes all `images/*` routes** from output since they're served from CDN. If you add local theme images, account for this deletion.

### `source/_data/`
- `pub.bib` — the **publications bibliography**. The `hexo-tag-publications` plugin renders entries referenced by citekey in `{% publications %}...{% endpublications %}` blocks (see `source/publications/index.md`, grouped by year).
- `header.njk` / `footer.njk` — theme partials wired via `_config.next.yml` `custom_file_path` (footer.njk serves as both footer and sidebar — it renders Recent Posts + ICP/beian footer widgets).
- `styles.styl` — theme style overrides.

### Content (`source/`)
- Page sections each live in their own directory with an `index.md`: `people/`, `research/`, `publications/`, `softwares/`, `teaching/`, `tips/`, `group-seminar/`, `memory/`. These map 1:1 to the NexT menu in `_config.next.yml`.
- `_posts/` — dated news posts (e.g. graduation congratulations, "our recent work..." announcements). New post scaffold: `hexo new "Title"` uses `scaffolds/post.md` (front matter: title, date, tags).
- Some legacy top-level dirs (`elementor-612`, `centos7-...`, `转载-安装-deepmd-kit-v1-0`) are migrated WordPress pages kept as-is for URL continuity — don't rename them.

### Publications tag plugin patch
`patches/hexo-tag-publications+0.3.8.patch` (applied by `patch-package` postinstall) customizes the publications renderer: converts `\textbf{...}` → `<strong>`, falls back to `EID`/`ARTICLE_NUMBER`/`ARTICLENUMBER` when pages are missing, and handles `\ensuremath`/`\textendase`. If publication rendering misbehaves, this patch is the first place to look.

### Image CDN
Most content images are hosted externally at `pic.njzjz.win` (Cloudflare-backed, see `hexo-image-cloudflare` plugin and `cdn` config). The `cdn` config transforms eligible image URLs to WebP and generates responsive `srcset` widths; `exclude_domains` lists `images.weserv.nl` and `unpkg.com` as exempt.

## Conventions

- Site language is `en` but content is bilingual (English headings, Chinese names/institution text). Match surrounding language when editing.
- Posts are titled in lowercase-hyphenated English slugs; people's names appear as `English (中文)`.
- Dependabot/Renovate is active (`renovate.json` extends `github>njzjz/renovate-config`); recent commit history is almost entirely lock-file maintenance — expect regular dependency PRs.
