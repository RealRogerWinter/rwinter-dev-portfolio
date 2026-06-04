#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Server-side deploy for the Roger Winter portfolio.
#
# Runs on the VPS as root, invoked by the least-privilege `deploy` user through
# an SSH *forced command* + a narrow sudoers rule (see docs/ci-cd.md). The only
# attacker-controlled input is $SSH_ORIGINAL_COMMAND, which must be the exact
# GHCR image digest CI wants to roll out. We validate it is one of OUR images
# (pinned by sha256 digest), then pull + restart the compose stack. Nothing else
# the SSH key can do but trigger this one script.
#
# Install: /usr/local/sbin/rwinter-deploy.sh  (root:root, 0755)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

STACK_DIR="/opt/rwinter-portfolio"
ALLOWED_PREFIX="ghcr.io/realrogerwinter/rwinter-dev-portfolio@sha256:"

REF="${SSH_ORIGINAL_COMMAND:-${1:-}}"

# Only accept a digest-pinned reference to our own image. No tags, no other repos.
case "$REF" in
	"${ALLOWED_PREFIX}"*[!\ ]) : ;;
	*) echo "deploy: refusing ref '${REF}'" >&2; exit 2 ;;
esac
# Reject anything with shell metacharacters / whitespace beyond the digest.
if printf '%s' "$REF" | grep -qE '[^a-zA-Z0-9:/@._-]'; then
	echo "deploy: invalid characters in ref" >&2; exit 2
fi

cd "$STACK_DIR"

# Remember the currently-running image for quick rollback.
PREV="$(docker compose ps --format '{{.Image}}' 2>/dev/null | head -1 || true)"
[ -n "$PREV" ] && echo "$PREV" > "$STACK_DIR/.previous-image"

echo "deploy: rolling out $REF (previous: ${PREV:-none})"
PORTFOLIO_IMAGE="$REF" docker compose pull
PORTFOLIO_IMAGE="$REF" docker compose up -d --remove-orphans

# Wait for health before declaring success.
for _ in $(seq 1 30); do
	if curl -fsS http://127.0.0.1:3001/healthz >/dev/null 2>&1; then
		echo "deploy: healthy — $REF"; docker image prune -f >/dev/null 2>&1 || true; exit 0
	fi
	sleep 1
done

echo "deploy: health check FAILED, rolling back to ${PREV:-none}" >&2
if [ -n "${PREV:-}" ]; then
	PORTFOLIO_IMAGE="$PREV" docker compose up -d --remove-orphans || true
fi
exit 1
