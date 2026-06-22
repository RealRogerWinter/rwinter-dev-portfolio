// Supply-chain + self-hosting invariants for the post-cutover site: nothing
// loads from a third-party CDN, the in-browser Babel + vendored-React eval
// runtime is gone for good, and the nav home link stays "/" (the 404-fix).
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { SITE, PAGES, read } from './_lib.js';

const ROOT = path.join(SITE, '..');
// Every built HTML page, so the no-CDN / no-Babel guards cover the whole
// shipped surface.
const ALL_PAGES = [...PAGES];

describe('supply-chain & self-hosting invariants', () => {
  it('no third-party CDN script references in any page', () => {
    for (const p of ALL_PAGES) expect(read(p), p).not.toMatch(/unpkg\.com|cdn\.jsdelivr|cdnjs\.|jsdelivr\.net/);
  });

  it('the in-browser Babel + vendored-React eval runtime is gone', () => {
    // The migration replaced in-browser Babel transpilation of window-global
    // JSX with prebuilt Astro islands. The transpiler and the vendored React
    // UMD builds must stay deleted, and no built page may reference them or
    // ship a `text/babel` script (which is what required script-src 'unsafe-eval').
    for (const f of ['vendor/babel.min.js', 'vendor/react.production.min.js', 'vendor/react-dom.production.min.js']) {
      expect(fs.existsSync(path.join(SITE, f)), `${f} should be deleted`).toBe(false);
    }
    for (const p of ALL_PAGES) {
      expect(read(p), p).not.toMatch(/babel(\.min)?\.js|react(-dom)?\.production\.min\.js|type="text\/babel"/);
    }
  });

  it("the deployed CSP no longer grants script-src 'unsafe-eval'", () => {
    // Closes the config-side gap the page-content guards can't see: removing
    // Babel let us drop 'unsafe-eval', and it must not creep back into nginx.
    const conf = fs.readFileSync(path.join(ROOT, 'deploy/default.conf'), 'utf8');
    const csp = conf.split('\n').find((l) => l.includes('Content-Security-Policy')) || '';
    expect(csp, "default.conf CSP must not contain 'unsafe-eval'").not.toMatch(/'unsafe-eval'/);
    expect(csp, 'sanity: the CSP line was found').toMatch(/script-src/);
  });

  it('nav home link is "/" (the 404-fix invariant)', () => {
    // Was window.HOME_FILE in site/portfolio/shell.jsx; now Nav.astro's HOME.
    expect(fs.readFileSync(path.join(ROOT, 'src/components/Nav.astro'), 'utf8')).toMatch(/HOME\s*=\s*'\/'/);
  });
});
