// Prints the sha256-base64 hashes of the executable inline scripts in the built
// dist/, as a ready-to-paste script-src snippet. Run `npm run csp:hashes` after an
// Astro/Vite upgrade or a theme-bootstrap edit changes them — tests/csp-hashes.test.js
// fails closed when deploy/default.conf drifts from these, and this is how you fix it.
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import crypto from 'node:crypto';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
// Keep in sync with tests/csp-hashes.test.js (only CSP-governed executable scripts).
const EXECUTABLE = new Set(['', 'module', 'text/javascript', 'application/javascript', 'text/ecmascript', 'application/ecmascript']);

if (!fs.existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build` first (or `npm run csp:hashes`).');
  process.exit(1);
}

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
        hashes.add("'sha256-" + crypto.createHash('sha256').update(m[2], 'utf8').digest('base64') + "'");
      }
    }
  }
};
walk(DIST);

const list = [...hashes].sort();
console.log(`\n${list.length} distinct executable inline script(s). Paste into deploy/default.conf script-src:\n`);
console.log(`script-src 'self' ${list.join(' ')};\n`);
