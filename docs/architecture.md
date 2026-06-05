# Architecture

This document describes how the Roger Winter portfolio is built, structured, and deployed. It is the companion to the deploy runbook (`docs/deploy.md`), CI/CD reference (`docs/ci-cd.md`), and DNS/TLS bring-up (`docs/cloudflare-setup.md`).

> **Migration complete.** The site is now an [Astro](https://astro.build) app (see
> [`docs/adr/0001-migrate-to-astro-islands.md`](adr/0001-migrate-to-astro-islands.md)).
> `npm run build` renders every page from `src/pages/` to static HTML in `dist/`,
> copies `site/` (fonts, images, favicon) verbatim, and ships JavaScript **only** for
> the interactive React islands — bundled to content-hashed `/_astro/`. The in-browser
> `@babel/standalone` transpiler, the vendored React UMD scripts, and the `window.*`
> global components are all gone; with them, `script-src 'unsafe-eval'` was dropped
> from the CSP. **Sections 2–3 below describe the original pre-migration model, kept
> for provenance.** Current structure: `src/pages/*.astro` (pages), `src/layouts/`
> (the shared shell + pre-paint theme bootstrap), `src/components/` (chrome + the
> `viz/` React islands), `src/content/` (the writeups collection), and `src/styles/`
> (the extracted stylesheets the pages link).

## 1. What the site is

The portfolio at [rogerwinter.dev](https://rogerwinter.dev) is a **lightweight, multi-page static site**. It has eight deployed pages — `index.html` (home), `bio.html`, `contact.html`, and five project pages served at clean, extensionless URLs (`/projects/sheet-llm`, `/projects/onestreamer`, `/projects/price-games`, `/projects/pricey`, `/projects/multilingual-seo`) — plus a `writeups/` section, `favicon.svg`, `robots.txt`, and a generated `sitemap.xml`. `npm run build` (Astro) renders these to `dist/` (the project pages as `dist/projects/<id>.html`), which is what the nginx image serves; there is **no server-side application**. *(Originally — pre-migration — `site/` was the committed HTML and there was no build step; the rest of this section describes that historical model.)*

### Client-side React-via-Babel rendering model (historical — replaced by Astro islands)

Each page is shipped as plain static assets but renders **entirely in the browser**. The boot sequence in every HTML page is:

1. Load three self-hosted vendor scripts in order: `/vendor/react.production.min.js`, `/vendor/react-dom.production.min.js`, `/vendor/babel.min.js`.
2. Load the page's JSX components as `<script type="text/babel" src="…">` tags. `@babel/standalone` transpiles each JSX file to JavaScript **at runtime**.
3. A final inline `text/babel` script mounts the page's root component, e.g. on the home page:

```html
<script type="text/babel">
  ReactDOM.createRoot(document.getElementById('root')).render(<window.PortfolioSite />);
</script>
```

This mirrors exactly how the design preview ran, so the migrated site is visually faithful. Components are attached to `window.*` (rather than ES-module imports) so each `text/babel` script can reference those compiled earlier.

## 2. Page → root component → JSX dependency graph

All 21 components live in `site/portfolio/` (plus `site/tweaks-panel.jsx` at the root). Every page first loads the **common base** — `tweaks-panel.jsx`, `portfolio/data.jsx`, `portfolio/shell.jsx` — then page-specific components. Project and home pages additionally load `portfolio/microviz.jsx`; **`bio.html` and `contact.html` do not** (they need only the base plus their leaf component).

| Page | Root component | Page-specific JSX (after base) |
|---|---|---|
| `index.html` | `window.PortfolioSite` | `microviz`, `site.jsx` |
| `bio.html` | **Astro** — `src/pages/bio.astro` (migrated; static, zero JS) | n/a |
| `contact.html` | `window.ContactPage` | `contact.jsx` |
| `project-multilingual-seo.html` | `window.SeoToolPage` | `microviz`, `seo-viz`, `seo-demo`, `seotool.jsx` |
| `project-onestreamer.html` | `window.OneStreamerPage` | `microviz`, `os-diagrams`, `onestreamer.jsx` |
| `project-price-games.html` | `window.PriceGamesPage` | `microviz`, `pg-diagrams`, `pricegames.jsx` |
| `project-pricey.html` | `window.PriceyPage` | `microviz`, `pricey-viz`, `pricey-mood`, `pricey.jsx` |
| `project-sheet-llm.html` | `window.SheetLlmPage` | `microviz`, `sl-diagrams`, `sl-flows`, `sl-chat`, `sheetllm.jsx` |

`shell.jsx` provides the nav/page chrome and the home/back links; `data.jsx` holds project metadata; `microviz.jsx` renders the small inline visualizations. `tweaks-panel.jsx` is the design's theme engine (see §3). The Pricey page embeds a Twitch player iframe (`https://player.twitch.tv/...&parent=<dynamic hostname>`) with a static-image fallback.

## 3. Migration decisions & fixes (historical)

The Claude Design export was originally turned into `site/` by a
`scripts/build-site-from-design.py` generator (removed at the Astro cutover, along
with `scripts/fetch-vendor.sh` and `site/vendor/VENDOR.lock`). Its key decisions, kept
here for provenance:

- **Faithful serve.** Kept the in-browser Babel render model so the output matched the design preview pixel-for-pixel; no rewrite to a bundler. *(Superseded: the Astro migration reproduced the same look via the visual-regression oracle while replacing Babel with prebuilt islands.)*
- **Self-hosted vendor.** The three CDN (`unpkg`) `<script>` tags were rewritten to `/vendor/*`, removing any runtime CDN dependency. Files and SHA-384 hashes were pinned in `site/vendor/VENDOR.lock`. *(Superseded: React is now build-bundled to `/_astro/`; only the subset fonts remain under `vendor/`.)*
- **React dev → prod swap.** `react.development.js` / `react-dom.development.js` were swapped for the **production minified** builds (React 18.3.1): semantically identical render, smaller, no dev console noise.
- **Babel kept + SRI-verified.** `@babel/standalone` 7.29.0 (`babel.min.js`, ~3.1 MB) is kept verbatim and byte-verified against the design's Subresource-Integrity hash.
- **`HOME_FILE` 404 fix.** The export set `shell.jsx` `HOME_FILE` to `"Roger Winter — Portfolio.html"` (em-dash), which never matched the hyphenated real filename, so every nav/back link would 404 as a static site. Changed to `"/"`, and `Bio.html`/`Contact.html` references lowercased.
- **Rename + clean URLs.** `"Roger Winter - Portfolio.html"` → `index.html`; `Bio.html`/`Contact.html` → lowercase.
- **SEO added.** Per-page `description` + OpenGraph/Twitter meta + `canonical`, plus `favicon.svg`, `robots.txt`, and `sitemap.xml`.
- **Dropped from the export** (not real pages or unused): `design-canvas.jsx`, `Nav Variants.html`, `Portfolio Explorations.html`, `directions/`, `site_terminal_backup.jsx`, `project.jsx`, `navvariants.jsx`, and the unused `screenshots/` + `uploads/` originals. Only `portfolio/assets/` images are kept.
- **`tweaks-panel` inert in production.** Its floating edit panel opens only when a Claude Design *host* posts `__activate_edit_mode`; with no such host in production, it is permanently invisible and inert.

## 4. Deploy topology

The site is served by a hardened, non-root nginx container (`nginxinc/nginx-unprivileged:1.27-alpine`, uid 101, listening on `:8080`) bound to **loopback only** (`127.0.0.1:3001`). The shared host **Caddy** terminates TLS and Cloudflare Authenticated Origin Pulls (mTLS) and reverse-proxies in.

```
            Browser
               │  HTTPS
               ▼
   Cloudflare edge  (proxy / WAF / cache)
               │  Full (strict) + Authenticated Origin Pull (mTLS)
               ▼
   Caddy on the VPS :443         (shared with sheet-llm; LE cert via DNS-01)
               │  reverse_proxy 127.0.0.1:3001   (loopback only)
               ▼
   Docker: nginx-unprivileged    (non-root uid 101, read-only rootfs)
               └ serves static site on :8080  ·  /healthz probe
```

Container hardening (`docker-compose.yml`): `read_only` rootfs with tmpfs for `/tmp`, `/var/cache/nginx`, `/var/run`; `cap_drop: ALL`; `no-new-privileges:true`; `mem_limit: 128m`; HEALTHCHECK on `/healthz`; json-file log rotation (10m × 5). The site needs **no runtime secrets**. `nginx` (`deploy/default.conf`) sets a strict CSP and cache policy: HTML/JSX revalidate every request so deploys are picked up immediately, while `/vendor/*`, images, and fonts cache for a week. It also serves the project pages at clean, extensionless `/projects/<id>` URLs (mapped onto the built `/projects/<id>.html`) and 301-redirects the page-less `/projects` and any legacy `/project-<id>.html` links to their canonical target.

## 5. Known limitations & future work

- **Precompile JSX to drop in-browser Babel.** `babel.min.js` is ~3 MB shipped to every visitor and transpiles on each load. Precompiling JSX to JS at build time would remove that payload **and** let the CSP drop `'unsafe-eval'`/`'unsafe-inline'` from `script-src` (currently required only by the runtime Babel transform).
- **SEO of client-rendered pages.** Content is rendered client-side, so crawlers see an empty `<div id="root">` plus the meta tags. Consider SSR or build-time prerendering to emit real HTML.
- **Optimize large screenshots.** `portfolio/assets/onestreamer-stream.png` (~4.4 MB) and `pricey-stream.png` (~1.5 MB) dominate page weight; recompress and/or convert to WebP/AVIF with responsive sizes.
- **Self-host Google Fonts.** Fonts currently load from `fonts.googleapis.com`/`fonts.gstatic.com`. Self-hosting them would remove the third-party dependency and tighten `style-src`/`font-src`.
