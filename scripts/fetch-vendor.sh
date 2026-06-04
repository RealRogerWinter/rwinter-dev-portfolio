#!/usr/bin/env bash
# Download self-hosted front-end vendor libs into site/vendor/.
# React is pinned to the same version the design used (18.3.1) but switched
# dev -> production min (identical render, smaller, no console noise). Babel
# standalone is byte-verified against the SRI hash the design shipped.
set -euo pipefail

DST="$(cd "$(dirname "$0")/.." && pwd)/site/vendor"
mkdir -p "$DST"

fetch() { curl -fsSL --retry 3 "$2" -o "$DST/$1"; echo "fetched $1"; }
fetch react.production.min.js     "https://unpkg.com/react@18.3.1/umd/react.production.min.js"
fetch react-dom.production.min.js "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"
fetch babel.min.js                "https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"

# Verify Babel against the Subresource Integrity hash the design export shipped,
# then write a lockfile recording exactly what we vendored.
python3 - "$DST" <<'PY'
import sys, hashlib, base64, os
dst = sys.argv[1]
def sri(p):
    return "sha384-" + base64.b64encode(hashlib.sha384(open(p,"rb").read()).digest()).decode()
expect_babel = "sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y"
got = sri(os.path.join(dst, "babel.min.js"))
if got != expect_babel:
    print("BABEL SRI MISMATCH\n expected", expect_babel, "\n got     ", got); sys.exit(1)
print("babel.min.js SRI verified against design export")
with open(os.path.join(dst, "VENDOR.lock"), "w") as f:
    f.write("# Vendored front-end libs (self-hosted; no runtime CDN dependency).\n")
    for name in ("react.production.min.js","react-dom.production.min.js","babel.min.js"):
        p = os.path.join(dst, name)
        f.write(f"{name}  {sri(p)}  {os.path.getsize(p)} bytes\n")
print(open(os.path.join(dst,"VENDOR.lock")).read())
PY
