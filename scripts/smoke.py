#!/usr/bin/env python3
"""Smoke-test the deployed portfolio: every page and every referenced asset
returns 200, security headers are present, and unknown paths 404.

Usage: scripts/smoke.py [BASE_URL]   (default http://127.0.0.1:3001)
Exit non-zero on any failure. Used locally and as a CI post-deploy gate.
"""
import sys, re, urllib.request, urllib.error

BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3001").rstrip("/")
PAGES = ["/", "/bio.html", "/contact.html",
         "/project-multilingual-seo.html", "/project-onestreamer.html",
         "/project-price-games.html", "/project-pricey.html",
         "/project-sheet-llm.html"]
fails = []
# A real browser UA: Cloudflare's bot protection 403s the default Python-urllib UA.
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"

def get(path, want=200):
    url = BASE + path
    try:
        r = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=15)
        body = r.read()
        if r.status != want:
            fails.append(f"{path}: status {r.status} != {want}")
        return r, body
    except urllib.error.HTTPError as e:
        if e.code != want:
            fails.append(f"{path}: HTTP {e.code} != {want}")
        return e, b""
    except Exception as e:
        fails.append(f"{path}: {e}")
        return None, b""

# 1) pages + collect local sub-resources referenced in the static HTML
resources = set()
for p in PAGES:
    r, body = get(p)
    if r is None:
        continue
    ct = r.headers.get("Content-Type", "")
    if "text/html" not in ct:
        fails.append(f"{p}: content-type {ct!r} not html")
    text = body.decode("utf-8", "replace")
    for m in re.findall(r'(?:src|href)="([^"]+)"', text):
        if m.startswith(("http://", "https://", "#", "mailto:", "data:")):
            continue
        resources.add("/" + m.lstrip("/"))

# 2) pull asset references out of the served JSX (images are loaded at runtime)
jsx = [r for r in resources if r.endswith(".jsx")]
for j in jsx:
    _, body = get(j)
    for a in re.findall(r'portfolio/assets/[A-Za-z0-9 _./-]+\.(?:png|webp|avif|jpe?g|gif|svg|ico)', body.decode("utf-8", "replace")):
        resources.add("/" + a)

# 3) every referenced resource must 200
for res in sorted(resources):
    get(res)

# 4) endpoints
for p in ["/healthz", "/robots.txt", "/sitemap.xml", "/favicon.svg"]:
    get(p)

# 5) security headers on the home page
r, _ = get("/")
if r is not None:
    h = {k.lower(): v for k, v in r.headers.items()}
    for need in ["content-security-policy", "x-content-type-options", "x-frame-options"]:
        if need not in h:
            fails.append(f"home: missing header {need}")
    if "player.twitch.tv" not in h.get("content-security-policy", ""):
        fails.append("CSP missing frame-src player.twitch.tv")

# 6) negative: unknown path 404
get("/this-should-not-exist-xyz", want=404)

print(f"checked {len(PAGES)} pages + {len(resources)} resources at {BASE}")
if fails:
    print("FAIL (%d):" % len(fails))
    for f in fails:
        print("  -", f)
    sys.exit(1)
print("PASS — all pages, assets, headers OK")
