# Cloudflare setup — bringing rogerwinter.dev & rogerwinter.biz online

This guide brings the portfolio live behind Cloudflare. The canonical host is
**rogerwinter.dev**; **rogerwinter.biz** and both `www.*` hosts redirect to it
(the redirects are handled in Caddy, not Cloudflare — see
[`deploy/Caddyfile.rogerwinter.snippet`](../deploy/Caddyfile.rogerwinter.snippet)).

## Blocker (read first)

Neither `rogerwinter.dev` nor `rogerwinter.biz` is a zone in the Cloudflare
account that owns the current `CF_API_TOKEN`. That token today sees **only
`sheetllm.com`**. Caddy obtains its Let's Encrypt **server** certificates via
**DNS-01** using `acme_dns cloudflare {env.CF_API_TOKEN}`, so until both new
zones live in that account *and* the token can edit their DNS, certificate
issuance for the portfolio will fail. The two hard requirements that gate
go-live are therefore:

1. **Both zones onboarded to the same account** that holds `CF_API_TOKEN`.
2. **A token scoped `Zone:DNS:Edit` + `Zone:Read` covering both new zones**
   (and still `sheetllm.com`).

Plus, per zone, **Authenticated Origin Pulls** must be enabled and **SSL/TLS
mode set to Full (strict)**.

## 1. Onboard both zones to the same Cloudflare account

In the **same** Cloudflare account that owns `CF_API_TOKEN` (the one already
running `sheetllm.com`), use **Add a Site** twice — once for `rogerwinter.dev`
and once for `rogerwinter.biz`. Pick the Free plan. Cloudflare scans existing
DNS and then **assigns two nameservers per zone** (e.g.
`xavier.ns.cloudflare.com` / `dahlia.ns.cloudflare.com` — yours will differ).
Record the assigned nameservers for each zone; you need them in step 2.

> Keeping both zones in the **existing** account is preferred: the shared global
> Caddyfile options block (`email`, `acme_dns cloudflare {env.CF_API_TOKEN}`,
> `trusted_proxies` = Cloudflare ranges) already works for `sheetllm.com` and
> must not be duplicated. If you instead onboard the zones to a *different*
> account, you must **mint a new token** in that account and replace
> `CF_API_TOKEN` in `/etc/caddy/caddy.env` — but then the same token must also
> still cover `sheetllm.com`, so same-account is the simpler path.

## 2. Repoint nameservers at the registrar

At each domain's registrar, replace the existing nameservers with the two
Cloudflare nameservers assigned for **that specific zone** in step 1 (the
`.dev` zone and `.biz` zone get different NS pairs — do not mix them). Save,
then wait for propagation. Each zone flips to **Active** in the Cloudflare
dashboard once Cloudflare detects its nameservers (minutes to a few hours).
Do not proceed to TLS verification until both zones show **Active**.

## 3. DNS records (per zone)

In each zone create **proxied (orange-cloud)** records pointing at the VPS:

| Type | Name  | Value                     | Proxy   |
|------|-------|---------------------------|---------|
| A    | `@`   | `5.78.144.63`             | Proxied |
| AAAA | `@`   | `2a01:4ff:1f0:c2ad::1`    | Proxied |
| A    | `www` | `5.78.144.63`             | Proxied |
| AAAA | `www` | `2a01:4ff:1f0:c2ad::1`    | Proxied |

Orange-cloud (proxied) is required so traffic flows through Cloudflare and so
the origin only ever sees Cloudflare IPs — which is what the origin mTLS check
in step 6 depends on. Do this in **both** the `.dev` and `.biz` zones.

## 4. API token scope for DNS-01 (the blocker)

Caddy needs a token that can solve the DNS-01 challenge for **every** hostname
it serves. After both zones are Active, edit the token in **My Profile → API
Tokens** (or mint a fresh one) so its permissions are:

- **Zone → DNS → Edit**
- **Zone → Zone → Read**

scoped to **Include → Specific zone** for **`rogerwinter.dev`**,
**`rogerwinter.biz`**, **and `sheetllm.com`** (the existing zone must stay
covered, or sheet-llm's renewals break). The token value lives **only** in
`/etc/caddy/caddy.env` as `CF_API_TOKEN=...` — never commit it; this repo is
public.

Verify the **running** token can see all three zones without ever printing it.
On the VPS:

```bash
# Load only CF_API_TOKEN into this shell from the env file; never echo it.
export CF_API_TOKEN="$(sudo grep -oP '^CF_API_TOKEN=\K.*' /etc/caddy/caddy.env)"

# List zones the token can read; print only the zone names + status.
curl -s -H "Authorization: Bearer ${CF_API_TOKEN}" \
  "https://api.cloudflare.com/client/v4/zones?per_page=50" \
  | jq -r '.result[] | "\(.name)\t\(.status)"'

unset CF_API_TOKEN
```

Expected output includes `rogerwinter.dev active`, `rogerwinter.biz active`,
and `sheetllm.com active`. If a zone is missing, the token scope is wrong — fix
it before reloading Caddy. (You can also confirm validity with
`/client/v4/user/tokens/verify`, which returns `"status": "active"`.)

## 5. SSL/TLS mode: Full (strict)

In each zone, **SSL/TLS → Overview**, set the encryption mode to
**Full (strict)**. This makes Cloudflare validate the publicly-trusted
Let's Encrypt certificate that Caddy serves end-to-end. Flexible or Full
(non-strict) would break the security model — use **Full (strict)** for both
zones.

## 6. Authenticated Origin Pulls — required (per zone)

The Caddy site block for `rogerwinter.dev` uses
`client_auth { mode require_and_verify }` and trusts
`/etc/caddy/cf-origin-pull-ca.pem` (the Cloudflare Origin-Pull CA). That means
the origin **rejects any TLS client** that does not present Cloudflare's
origin-pull certificate. So you **must** enable Authenticated Origin Pulls or
every request 4xx/handshake-fails at the origin.

Enable it **zone-wide** in each zone via API (the dashboard exposes it under
**SSL/TLS → Origin Server → Authenticated Origin Pulls**):

```bash
for ZONE_ID in <DEV_ZONE_ID> <BIZ_ZONE_ID>; do
  curl -s -X PUT \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data '{"value":"on"}' \
    "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/settings/tls_client_auth" \
    | jq '.result.value'
done
```

Each call should return `"on"`. This is zone-level AOP (Cloudflare presents its
shared origin-pull cert), which matches Caddy trusting the public
`cf-origin-pull-ca.pem`.

## 7. Recommended edge settings

For each zone, under **SSL/TLS → Edge Certificates**:

- **Always Use HTTPS**: On
- **Minimum TLS Version**: TLS 1.2
- **Brotli**: On (the origin also compresses — see `deploy/default.conf`)

The **canonical redirect** (`www.*` and all of `rogerwinter.biz` →
`https://rogerwinter.dev`) is **not** a Cloudflare rule — it is handled in
Caddy, so do not add redirect Page Rules for it.

## 8. Append the Caddy snippet, reload, and verify

On the VPS, append the contents of `deploy/Caddyfile.rogerwinter.snippet` to the
shared `/etc/caddy/Caddyfile` (do **not** copy the global options block — it is
already shared with sheet-llm), then validate and reload:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Verify the site serves **through Cloudflare** (cert chains to Let's Encrypt,
served from the loopback container on `127.0.0.1:3001`):

```bash
curl -sI https://rogerwinter.dev/ | head -n1            # HTTP/2 200
curl -sI https://www.rogerwinter.dev/ | head -n1        # 301 -> rogerwinter.dev
curl -sI https://rogerwinter.biz/ | head -n1            # 301 -> rogerwinter.dev
```

Then confirm a **direct-to-origin** request (bypassing Cloudflare) **fails the
mTLS handshake** — proof that `require_and_verify` is working:

```bash
# No Cloudflare origin-pull client cert -> handshake must fail.
curl -v --resolve rogerwinter.dev:443:5.78.144.63 https://rogerwinter.dev/ 2>&1 \
  | grep -Ei 'alert|handshake|certificate required'
```

A successful response here would mean AOP/`client_auth` is misconfigured. The
expected result is a TLS alert (the origin demanding a client certificate),
while requests through Cloudflare succeed.
