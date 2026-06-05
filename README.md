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

The site renders client-side: each HTML page boots React (self-hosted) and
transpiles its JSX component graph with Babel in the browser — exactly as the
design preview ran, so it is visually faithful. Vendor libraries are
**self-hosted** (no runtime CDN dependency); React is the production build and
Babel is byte-verified against the design's Subresource-Integrity hash.

See [`docs/architecture.md`](docs/architecture.md) for the full picture and the
migration decisions (incl. the `HOME_FILE` fix and what was dropped from the
export).

## Repository layout

```
site/                     deployable static site (the source of truth)
  index.html              home  (renamed from "Roger Winter - Portfolio.html")
  bio.html  contact.html
  project-*.html          5 project pages
  tweaks-panel.jsx        design theme engine (panel is inert in production)
  portfolio/*.jsx         21 React components (shell, data, per-project)
  portfolio/assets/       images used by the site
  vendor/                 self-hosted React (prod) + Babel  (+ VENDOR.lock)
  favicon.svg robots.txt sitemap.xml
deploy/
  default.conf            nginx server block (headers, CSP, gzip, cache, health)
  Caddyfile.rogerwinter.snippet   site block to append to the shared Caddyfile
  deploy.sh               server-side forced-command deploy (root, via sudo)
Dockerfile                non-root nginx image
docker-compose.yml        loopback-only stack (127.0.0.1:3001), hardened
.circleci/config.yml      build → verify → push → APPROVE → deploy
scripts/
  fetch-fonts.py              (re)download + subset the self-hosted web fonts
  optimize-images.py          generate WebP variants of the heavy screenshots
  make-og-image.py            render the OpenGraph share card
  smoke.py                    post-deploy smoke test (pages/assets/headers/404)
docs/                     architecture, deploy runbook, security, CI/CD, Cloudflare
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

Open <http://127.0.0.1:3001/>. `site/` and `vendor/` are committed, so steps 1–2
are only needed when the design or vendored libs change.

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
