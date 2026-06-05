// Drift guard for the hash-locked CSP. The deployed script-src allowlists the
// site's inline scripts by sha256 hash instead of 'unsafe-inline'; this test
// recomputes those hashes from the built dist/ and asserts the CSP covers exactly
// them — no more, no less. If Astro's island-hydration runtime changes (e.g. an
// Astro/Vite upgrade) or the pre-paint theme bootstrap is edited, the built hash
// changes and this fails in CI, before a deploy can ship a CSP that would silently
// block hydration. dist/ must be built first; `npm test` does it via pretest.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { DIST } from './_lib.js';

const CONF = path.join(DIST, '..', 'deploy', 'default.conf');

// Script-src only governs EXECUTABLE inline scripts — a classic script (no type,
// or a JS MIME) or a module. Non-executable data blocks (application/json that
// Astro could emit for island props, ld+json structured data, importmaps) are not
// hash-checked by the browser, so they must not be required in the allowlist.
// The current build emits only bare `<script>` tags, so the type filter is
// defensive — it future-proofs the guard against an Astro change that adds a data
// block. (Keep this set in sync with scripts/print-csp-hashes.mjs.)
const EXECUTABLE = new Set(['', 'module', 'text/javascript', 'application/javascript', 'text/ecmascript', 'application/ecmascript']);
const REGEN = 'run `npm run csp:hashes` and paste the result into deploy/default.conf script-src';

// sha256-base64 of every distinct executable inline <script> (no src) across all
// built pages, matching exactly what a browser hashes for a CSP script-src allowlist.
function builtInlineHashes() {
  const hashes = new Set();
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const fp = path.join(dir, e.name);
      if (e.isDirectory()) walk(fp);
      else if (e.name.endsWith('.html')) {
        const html = fs.readFileSync(fp, 'utf8');
        const re = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g;
        let m;
        while ((m = re.exec(html))) {
          const type = (m[1].match(/\btype="([^"]*)"/) || [, ''])[1].toLowerCase();
          if (!EXECUTABLE.has(type)) continue;
          hashes.add('sha256-' + crypto.createHash('sha256').update(m[2], 'utf8').digest('base64'));
        }
      }
    }
  };
  walk(DIST);
  return hashes;
}

function cspScriptSrc() {
  const conf = fs.readFileSync(CONF, 'utf8');
  const csp = conf.split('\n').find((l) => l.includes('Content-Security-Policy')) || '';
  return (csp.match(/script-src ([^;]+);/) || [])[1] || '';
}

describe('hash-locked CSP covers exactly the built inline scripts', () => {
  it("script-src has neither 'unsafe-inline' nor 'unsafe-eval'", () => {
    const scriptSrc = cspScriptSrc();
    expect(scriptSrc, 'script-src found').toMatch(/'self'/);
    expect(scriptSrc).not.toMatch(/'unsafe-inline'/);
    expect(scriptSrc).not.toMatch(/'unsafe-eval'/);
  });

  it('every built inline script is allowlisted, and every CSP hash is used', () => {
    const built = builtInlineHashes();
    const csp = new Set([...cspScriptSrc().matchAll(/'(sha256-[^']+)'/g)].map((m) => m[1]));
    expect(built.size, 'the build emits at least one inline script').toBeGreaterThan(0);
    // No built inline script may be blocked (missing from the CSP)...
    for (const h of built) expect([...csp], `built inline script ${h} is not allowlisted in default.conf — ${REGEN}`).toContain(h);
    // ...and no CSP hash may be stale (allowlisting a script no page emits).
    for (const h of csp) expect([...built], `CSP hash ${h} matches no built inline script (stale) — ${REGEN}`).toContain(h);
  });
});
