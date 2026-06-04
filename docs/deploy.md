# Deploy Runbook — Roger Winter Portfolio

Operational guide for deploying and operating the static portfolio on the VPS.
The site is plain static assets served by a hardened, non-root nginx container
bound to **loopback only**; the shared host **Caddy** terminates TLS, enforces
Cloudflare Authenticated Origin Pull (mTLS), and reverse-proxies in.

- **Server:** Hetzner VPS, Ubuntu 26.04, `${VPS_HOST}` / `${VPS_HOST_V6}`
- **Stack dir:** `/opt/rwinter-portfolio` (root-owned, mirrors `/opt/sheet-llm`)
- **Container port:** `127.0.0.1:3001 -> 8080` (sheet-llm owns `3000` — never touch it)
- **Image:** `ghcr.io/realrogerwinter/rwinter-dev-portfolio` (pinned by `@sha256:` digest)
- **Canonical host:** `https://rogerwinter.dev` (`rogerwinter.biz` + `www.*` redirect to it)

> Routine deploys run automatically through CircleCI (see `docs/ci-cd.md`): the
> pipeline builds, pushes a digest-pinned image to GHCR, waits for **manual
> approval**, then SSHes the digest to the VPS. This runbook covers first-time
> setup, manual deploys, go-live, verification, and recovery.

## Prerequisites already on the VPS

These are shared with sheet-llm and **must not be reinstalled or duplicated**:

- **Docker + Compose v2.** `claudeuser` is *not* in the `docker` group, so all
  privileged Docker operations use `sudo docker ...`.
- **Caddy** (`systemd` service `caddy`) — a custom build that includes
  `caddy-dns/cloudflare`. The **global options block already exists** in
  `/etc/caddy/Caddyfile` (email, `acme_dns cloudflare {env.CF_API_TOKEN}` with
  the token in `/etc/caddy/caddy.env`, Cloudflare `trusted_proxies` +
  `client_ip_headers`). Do not re-add it.
- **Cloudflare Origin-Pull CA** at `/etc/caddy/cf-origin-pull-ca.pem`.

## First-time server setup

Create the stack directory and place the compose file (root-owned):

```bash
sudo mkdir -p /opt/rwinter-portfolio
sudo cp docker-compose.yml /opt/rwinter-portfolio/docker-compose.yml
```

The static site needs **no runtime secrets and no `.env`**. The container image
either comes from GHCR (CI builds and pushes it) or is built locally from a
checkout. The compose file defaults the image to `rwinter-portfolio:local` and
overrides it with the `PORTFOLIO_IMAGE` environment variable in production.

## Manual first deploy

**Option A — pull a published GHCR digest** (the normal path; mirrors what CI
and `deploy/deploy.sh` do). Run from the stack dir:

```bash
cd /opt/rwinter-portfolio
sudo PORTFOLIO_IMAGE=ghcr.io/realrogerwinter/rwinter-dev-portfolio@sha256:<digest> \
  docker compose up -d
```

**Option B — build locally from a checkout** (no GHCR access needed):

```bash
sudo docker compose up -d --build
```

Either way the container comes up on `127.0.0.1:3001`. Confirm health before
wiring Caddy:

```bash
curl -fsS http://127.0.0.1:3001/healthz && echo OK
```

## Wiring Caddy

Append the portfolio site blocks to the shared Caddyfile, validate, then reload.
The snippet (`deploy/Caddyfile.rogerwinter.snippet`) defines the apex
`reverse_proxy 127.0.0.1:3001` with `client_auth mode require_and_verify`
against the Cloudflare Origin-Pull CA, plus the `www` and `.biz` redirects. It
relies on the **already-present** global options block and does not repeat it.

```bash
sudo tee -a /etc/caddy/Caddyfile < deploy/Caddyfile.rogerwinter.snippet
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

## Go-live order (do these in sequence)

The Caddy block requires both the container *and* Cloudflare to be ready, or the
TLS/mTLS handshake and DNS-01 issuance will fail. Follow this order:

1. **Container up on `127.0.0.1:3001`** — manual deploy above; `/healthz` returns 200.
2. **Cloudflare ready** — onboard **both** `rogerwinter.dev` and
   `rogerwinter.biz` as zones in the same Cloudflare account as `CF_API_TOKEN`
   (today that token sees only `sheetllm.com`), set proxied (orange-cloud)
   A/AAAA records to `${VPS_HOST}` / the IPv6 address, enable **Authenticated
   Origin Pulls** per zone, and set **SSL/TLS mode Full (strict)**. Full steps:
   **see `docs/cloudflare-setup.md`**. *This is the current go-live blocker.*
3. **Caddy block** — append the snippet, `caddy validate`, `systemctl reload caddy`
   (above). Caddy obtains the Let's Encrypt cert via DNS-01 on first request.
4. **Verify** — run the checks below.

## Verification

Run the smoke test against the public origin. It checks that every page and
referenced asset returns 200, security headers (CSP incl. `frame-src
player.twitch.tv`, `X-Content-Type-Options`, `X-Frame-Options`) are present, and
unknown paths 404:

```bash
python3 scripts/smoke.py https://rogerwinter.dev
```

Then confirm the origin **only** accepts real Cloudflare connections. A
direct-to-origin request (bypassing Cloudflare, so it presents no client cert)
must **fail the mTLS handshake**:

```bash
curl -vk --resolve rogerwinter.dev:443:${VPS_HOST} https://rogerwinter.dev
```

This should be **rejected** during the TLS handshake (no HTTP response),
proving `require_and_verify` is enforced and the origin is not directly
reachable. Public requests through Cloudflare continue to work normally.

## Rollback

`deploy/deploy.sh` records the previously-running image to
`/opt/rwinter-portfolio/.previous-image` before each rollout and **auto-rolls
back** if `/healthz` does not pass within ~30s. To roll back manually, redeploy
the last-good digest:

```bash
cd /opt/rwinter-portfolio
sudo PORTFOLIO_IMAGE="$(cat .previous-image)" docker compose up -d --remove-orphans
curl -fsS http://127.0.0.1:3001/healthz && echo OK
```

## Logs & health

```bash
cd /opt/rwinter-portfolio
sudo docker compose ps                 # container + health status
sudo docker compose logs --tail=100    # nginx access/error logs (json-file, 10m x5)
sudo docker compose logs -f            # follow
```

For the proxy layer: `sudo journalctl -u caddy -e`.

## Coexistence with sheet-llm

The portfolio and sheet-llm are **independent Docker Compose projects** on the
same host. They are isolated by port — portfolio on `127.0.0.1:3001`, sheet-llm
on `127.0.0.1:3000` — and share only the host Caddy, which routes by hostname
(`rogerwinter.dev` vs `sheetllm.com`). Both bind loopback only and are reached
solely through Caddy.

**Never modify, restart, or reference changes to sheet-llm** when operating the
portfolio. The only shared file is `/etc/caddy/Caddyfile`; the portfolio appends
its own site blocks and leaves the global options block and the sheet-llm block
untouched.
