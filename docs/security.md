# Security Posture

This document describes the security posture of the Roger Winter portfolio for its
public launch. The site is a **lightweight static portfolio** served by a hardened,
non-root nginx container behind Cloudflare and a shared Caddy reverse proxy. It has
**no backend, no database, and no runtime secrets**, which keeps the attack surface
small. Defence-in-depth still applies at the container, network, HTTP, secret, and
supply-chain layers.

## 1. Container Hardening

The container is built from a pinned, minimal base and runs with least privilege.
See `Dockerfile` and `docker-compose.yml`.

- **Pinned base image** — `nginxinc/nginx-unprivileged:1.27-alpine`. The
  *unprivileged* variant runs nginx as **uid 101** (non-root) and listens on
  `:8080`, so no master process runs as root and no capability is needed to bind a
  low port.
- **Read-only root filesystem** — `read_only: true`. Nothing writes to the image
  filesystem; the only writable paths are explicit `tmpfs` mounts (`/tmp`,
  `/var/cache/nginx`, `/var/run`) that vanish on restart.
- **All capabilities dropped** — `cap_drop: [ALL]`. Serving static files needs none.
- **No privilege escalation** — `security_opt: [no-new-privileges:true]` blocks
  setuid/`execve` privilege gains.
- **Memory cap** — `mem_limit: 128m` bounds blast radius from a runaway/abusive
  request pattern.
- **Health check** — both the `Dockerfile` `HEALTHCHECK` and the compose
  `healthcheck` probe `/healthz`, so an unhealthy container is detected and the
  deploy script (below) refuses to promote it.

## 2. Network

The application is **never directly reachable from the internet**.

- **Loopback-only bind** — compose maps `127.0.0.1:3001:8080`. The container is
  bound to loopback, not `0.0.0.0`, so only processes on the VPS (i.e. Caddy) can
  reach it. (`3000` is owned by sheet-llm.)
- **Cloudflare in front** — the canonical host `rogerwinter.dev` is proxied through
  Cloudflare with SSL/TLS mode **Full (strict)**, so the edge-to-origin hop is
  TLS-verified end to end.
- **Authenticated Origin Pull (mTLS)** — the origin (Caddy) presents the Cloudflare
  origin-pull CA at `/etc/caddy/cf-origin-pull-ca.pem` and **only accepts requests
  bearing a valid Cloudflare client certificate**, so the origin cannot be hit by
  bypassing Cloudflare directly.
- **Host firewall** — origin ports 80/443 are firewalled to the Cloudflare IP ranges
  at the host level, inherited from the shared server setup. Combined with mTLS, this
  makes Cloudflare the only viable ingress path.

Server TLS certificates come from Let's Encrypt via **DNS-01** (`acme_dns
cloudflare`) in the shared global Caddyfile options block, which also configures
`trusted_proxies` to the Cloudflare ranges (+ `trusted_proxies_strict`) and
`client_ip_headers Cf-Connecting-Ip X-Forwarded-For` so real client IPs are
preserved without spoofing.

## 3. HTTP Security Headers & CSP

Every response carries security headers, set in `deploy/default.conf`:

- `X-Content-Type-Options: nosniff` — disables MIME sniffing.
- `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'` — the site cannot be
  framed (clickjacking defence).
- `Referrer-Policy: strict-origin-when-cross-origin` — trims referrer leakage.
- `Permissions-Policy: geolocation=(), microphone=(), camera=(), browsing-topics=()`
  — disables powerful/abused browser features the site never uses.
- `server_tokens off` — hides the nginx version.

The Content-Security-Policy is scoped to exactly what the site loads:

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src  'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src   'self' https://fonts.gstatic.com;
img-src    'self' data:;
connect-src 'self';
frame-src  https://player.twitch.tv;
frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'
```

- `default-src 'self'` — deny-by-default; everything falls back to same-origin.
- `script-src 'self' 'unsafe-inline' 'unsafe-eval'` — **`'unsafe-inline'` and
  `'unsafe-eval'` are required ONLY by the in-browser Babel runtime.** Each page boots
  React and transpiles its JSX with `@babel/standalone` in the browser; Babel
  compiles JSX to JS strings and evaluates them, which needs `eval`, and the inline
  bootstrap scripts need `'unsafe-inline'`. **Precompiling the JSX to plain JS at
  build time removes Babel entirely and lets us tighten this to `'self'` (ideally
  nonce/hash-based).** This is the single biggest CSP weakening today.
- `style-src`/`font-src` — `'self'` plus Google Fonts (`fonts.googleapis.com`
  stylesheet, `fonts.gstatic.com` font files).
- `img-src 'self' data:` — same-origin images (only `portfolio/assets/`) plus inline
  `data:` images.
- `connect-src 'self'` — no third-party fetch/XHR/WebSocket egress.
- `frame-src https://player.twitch.tv` — **scoped to the Twitch player for the Pricey
  page embed** (with a static-image fallback); no other origin may be framed.
- `base-uri 'self'`, `form-action 'self'`, `object-src 'none'` — block `<base>`
  hijacking, off-site form posts, and plugin/object embedding.

## 4. Secret Hygiene

There are **no secrets in the repo, the image, or the logs** — the static site needs
no runtime secrets/`.env`.

- **`.gitignore`** excludes `.env`, `.env.*`, `*.pem`, `*.key`, `secrets/`,
  `*-token`, `*.secret`, and the local `design-src/` export.
- **`.dockerignore`** keeps the build context to `site/` + `deploy/default.conf`,
  excluding `.git`, `.circleci`, `docs`, `scripts`, `*.md`, etc., so nothing
  sensitive can be baked into the image.
- **CI secret scan** — the `verify` job greps the built image for secret-like strings
  (`BEGIN .*PRIVATE KEY`, `ghp_`, `sk-ant`) and fails the build if any are found.
- **CI uses contexts, not in-repo secrets** — context `ghcr-push` (`GHCR_USER`,
  `GHCR_TOKEN`) and context `deploy` (`VPS_KNOWN_HOSTS`); the `deploy@VPS` private key
  lives only in CircleCI project SSH settings. `GHCR_TOKEN` is a dedicated machine-user
  classic PAT with **`write:packages` only** — never the broad admin PAT.
- **Least-privilege deploy** — the `deploy` user's `authorized_keys` pins a **forced
  command** (`sudo /usr/local/sbin/rwinter-deploy.sh`, repo `deploy/deploy.sh`) with
  `no-pty,no-port-forwarding,no-agent-forwarding,no-X11-forwarding`, and a NOPASSWD
  sudoers rule lets `deploy` run **only that one script** as root. The script
  **validates `$SSH_ORIGINAL_COMMAND` is a `ghcr.io/realrogerwinter/
  rwinter-dev-portfolio@sha256:...` digest of our image** (rejecting tags, other
  repos, whitespace, and shell metacharacters) before `pull && up -d`, then waits for
  `/healthz` and rolls back to `.previous-image` on failure. A stolen deploy key can
  therefore only roll out a verified digest of *our* image — nothing else.

## 5. Supply Chain

- **Vendored front-end libs** — React 18.3.1 (production UMD) and
  `@babel/standalone` 7.29.0 are **self-hosted in `site/vendor/`**; there is no
  runtime CDN dependency.
- **`site/vendor/VENDOR.lock`** records each file's exact SHA-384 SRI hash and byte
  size; Babel was **byte-verified against the design export's Subresource-Integrity
  hash**, so the bundle we ship is provably the one we vetted.
- **Pinned nginx base** — `nginxinc/nginx-unprivileged:1.27-alpine`.
- **Image pinned by digest at deploy** — CI captures `RepoDigests` after push, and
  the VPS only ever runs a `@sha256:...` digest, so deploys are immutable and
  reproducible (no mutable-tag drift).

## 6. Hardening Checklist

- [x] Non-root container (uid 101), read-only rootfs + tmpfs, `cap_drop ALL`,
      `no-new-privileges`, `mem_limit`, health check.
- [x] App bound to loopback only; never directly public.
- [x] Cloudflare Full (strict) + Authenticated Origin Pull mTLS; origin 80/443
      firewalled to Cloudflare ranges.
- [x] Security headers + tightly scoped CSP.
- [x] No secrets in repo/image/logs; CI secret-scan; contexts; forced-command +
      digest-validated deploy; narrow sudoers.
- [x] Vendored libs with SRI hashes in `VENDOR.lock`; base image + deploy image
      pinned.

## Residual Risks & Future Work

- **In-browser Babel forces `'unsafe-inline'`/`'unsafe-eval'`.** *Highest priority:*
  precompile JSX to JS at build time, drop `@babel/standalone`, and tighten
  `script-src` to `'self'` (nonce/hash-based, no `eval`).
- **Vendor `<script>` tags do not yet carry `integrity=` SRI attributes.** The hashes
  are recorded in `VENDOR.lock`; wire them onto the actual `<script>` tags so a
  tampered local file fails closed.
- **No edge WAF / rate limiting yet.** Enable Cloudflare WAF managed rules and a
  rate-limit rule once the zones are onboarded, since the origin has no app-layer
  throttling.
- **Token hygiene.** Keep `GHCR_TOKEN` scoped to `write:packages`; rotate it and any
  Cloudflare API tokens periodically, and prefer a narrowly-scoped CF token
  (`Zone:DNS:Edit` + `Zone:Read`) over a broad one.

> **Go-live blocker:** `rogerwinter.dev` and `rogerwinter.biz` are **not yet zones**
> in the Cloudflare account that owns `CF_API_TOKEN` (which currently sees only
> `sheetllm.com`). Public launch requires onboarding both zones to that account (or
> minting a new token) with DNS edit rights for DNS-01, Authenticated Origin Pulls
> enabled per zone, and SSL/TLS mode **Full (strict)**. `rogerwinter.biz` and `www.*`
> redirect to the canonical `rogerwinter.dev`.
