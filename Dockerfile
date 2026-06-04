# Roger Winter portfolio — a static site served by hardened, non-root nginx.
# The site is pre-built by the CI build_site job: Astro copies site/ verbatim and
# renders any migrated pages into dist/. This image just copies that dist/ into an
# unprivileged nginx image that already runs as uid 101 on :8080. The runtime
# ships zero Node. dist/ is gitignored, so it must be present in the build context
# (the CI workspace) — `docker build .` from a bare checkout would have no dist/.
FROM nginxinc/nginx-unprivileged:1.27-alpine@sha256:65e3e85dbaed8ba248841d9d58a899b6197106c23cb0ff1a132b7bfe0547e4c0

# Server config (security headers, gzip, cache policy, /healthz).
COPY deploy/default.conf /etc/nginx/conf.d/default.conf

# Pre-built static site (verbatim pages, JSX, self-hosted vendor + fonts, assets,
# and any migrated Astro pages).
COPY --chown=101:0 dist/ /usr/share/nginx/html/

EXPOSE 8080

# Liveness: hit the /healthz endpoint from inside the container.
HEALTHCHECK --interval=30s --timeout=4s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz >/dev/null 2>&1 || exit 1

# Base image's CMD already launches nginx as the non-root "nginx" user.
