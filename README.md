# rwinter-dev-portfolio

Personal portfolio for **Roger Winter** — [rogerwinter.dev](https://rogerwinter.dev)
(canonical; **rogerwinter.biz** redirects to it).

A lightweight, multi-page static site migrated from a Claude Design export. It
showcases five projects — sheet-llm, OneStreamer, Price Games, Pricey, and the
Multilingual SEO Tool — plus bio and contact pages.

> **Status:** private repo, intended to become public. Practising
> public-from-day-one hygiene: no secrets in git, image, or logs (see
> [`docs/security.md`](docs/security.md)). Finalize [`LICENSE`](LICENSE) before
> flipping public.

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
  build-site-from-design.py   regenerate site/ from the design export
  fetch-vendor.sh             (re)download + verify vendored libs
  smoke.py                    post-deploy smoke test (pages/assets/headers/404)
docs/                     architecture, deploy runbook, security, CI/CD, Cloudflare
```

## Local development

```bash
# 1) (re)generate site/ from the design export — only needed if the design changes
python3 scripts/build-site-from-design.py     # reads /…/design-src/extracted
bash    scripts/fetch-vendor.sh               # populates site/vendor/

# 2) build + run the container (loopback :3001)
docker compose up -d --build

# 3) verify
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
