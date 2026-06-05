# rwinter-dev-portfolio

Personal portfolio for **Roger Winter** — [rogerwinter.dev](https://rogerwinter.dev)
(canonical; **rogerwinter.biz** redirects to it).

A lightweight, multi-page static site migrated from a Claude Design export. It
showcases five projects — sheet-llm, OneStreamer, Price Games, Pricey, and the
Multilingual SEO Tool — plus bio and contact pages.

> **Status:** public. Built with public-from-day-one hygiene: no secrets in
> git, image, or logs (see [`docs/security.md`](docs/security.md)). Licensing is
> split — MIT for the infrastructure/tooling, all rights reserved for the site
> content; see [`LICENSE`](LICENSE).

## Architecture at a glance

```
Browser ──TLS──▶ Cloudflare edge (proxy / WAF / cache)
                   │  Full(strict) + Authenticated Origin Pull (mTLS)
                   ▼
                Caddy on the host :443   (shared; LE cert via DNS-01)
                   │  reverse_proxy 127.0.0.1:3001   (loopback only)
                   ▼
                Docker: nginx-unprivileged (non-root, read-only rootfs)
                   └ serves the static site on :8080
```

The site is an [Astro](https://astro.build) app: every page is prerendered to
static HTML at build time, and JavaScript ships **only** for the interactive
React-island visualizations (bundled to content-hashed `/_astro/*`, served
same-origin). There is no runtime CDN dependency and no in-browser transpile, so
`script-src` carries neither `'unsafe-eval'` nor `'unsafe-inline'`. Project pages
are served at clean, extensionless URLs — `/projects/<id>`.

See [`docs/architecture.md`](docs/architecture.md) for the full picture and the
migration decisions (incl. the `HOME_FILE` fix and what was dropped from the
export).

## Repository layout

```
src/                      Astro source — what `npm run build` renders to dist/
  pages/                  routes: index, bio, contact, projects/<id>, writeups/, sitemap.xml.js
  layouts/  components/   shared shell + chrome + React-island viz (components/viz/)
  content/  data/         writeups collection + project metadata
  styles/                 per-page stylesheets the pages link
site/                     publicDir — copied verbatim into the build output
  portfolio/assets/       images used by the site
  vendor/fonts/           self-hosted, subset web fonts
  favicon.svg  robots.txt
astro.config.mjs          build config (publicDir=site, outDir=dist, format=file)
deploy/
  default.conf            nginx server block (headers, CSP, gzip, cache, clean URLs, health)
  Caddyfile.rogerwinter.snippet   site block to append to the shared Caddyfile
  deploy.sh               server-side forced-command deploy (root, via sudo)
Dockerfile                non-root nginx image (serves the prebuilt dist/)
docker-compose.yml        loopback-only stack (127.0.0.1:3001), hardened
.circleci/config.yml      lint/test/visual/verify → build → push → APPROVE → deploy
scripts/
  fetch-fonts.py              (re)download + subset the self-hosted web fonts
  optimize-images.py          generate WebP variants of the heavy screenshots
  make-og-image.py            render the OpenGraph share card
  print-csp-hashes.mjs        recompute the CSP script-src hashes from the build
  smoke.py                    post-deploy smoke test (pages/assets/headers/404s)
tests/                    vitest (structure/SEO/integrity/…) + Playwright visual harness
docs/                     architecture, deploy runbook, security, CI/CD, Cloudflare, ADRs
```

## Local development

The site is an [Astro](https://astro.build) app: `src/pages/` (pages + content),
`src/components/` (chrome + React-island viz), and `site/` (verbatim-copied static
assets — fonts, images, favicon). `npm run build` renders it all to `dist/`.

```bash
# 1) install + develop (Astro dev server, hot reload)
npm install
npm run dev                                    # http://localhost:4321

# 2) build the static site (-> dist/) and run the checks
npm run build
npm test                                       # vitest: structure, SEO, integrity, images, …
npm run test:visual                            # Playwright pixel oracle (local-authoritative)
npm run lint                                   # htmlhint on the built dist/

# 3) build + run the production container (loopback :3001), then smoke-test
docker compose up -d --build
python3 scripts/smoke.py http://127.0.0.1:3001
```

Open <http://127.0.0.1:3001/>. The tests and the container both consume the built
`dist/`, so `npm run build` must run first; `npm test` does it automatically via
its `pretest` hook.

## Deployment

Pushes to `main` run the CircleCI pipeline: build the image, run it and
smoke-test it, push to GHCR pinned by `sha256`, then **wait for manual
approval** before SSHing the pinned digest to the VPS, where a locked-down
forced command pulls and restarts the stack and rolls back if health fails.

Full runbook: [`docs/deploy.md`](docs/deploy.md) ·
CI/CD + required secrets/contexts: [`docs/ci-cd.md`](docs/ci-cd.md) ·
DNS/TLS bring-up: [`docs/cloudflare-setup.md`](docs/cloudflare-setup.md).

## License

See [`LICENSE`](LICENSE). Tooling is MIT-intended; site content and images are
© Roger Winter, all rights reserved. Vendored libraries keep their own licenses.
