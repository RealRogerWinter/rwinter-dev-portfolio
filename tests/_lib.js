// Shared helpers for the static-site test suite (not a test file itself).
import fs from 'node:fs';
import path from 'node:path';

export const SITE = path.join(import.meta.dirname, '..', 'site');
export const DIST = path.join(import.meta.dirname, '..', 'dist');

// The eight real, deployed pages.
export const PAGES = [
  'index.html', 'bio.html', 'contact.html',
  'project-multilingual-seo.html', 'project-onestreamer.html',
  'project-price-games.html', 'project-pricey.html', 'project-sheet-llm.html',
];

// Page-shape tests (structure/seo/resources/fonts/integrity-page checks) validate
// the BUILT output (dist/) — what actually ships, including pages migrated to
// Astro. Source-only tests (transpile, vendor SRI) use SITE directly. dist/ must
// be built first; `npm test` does it via the pretest hook, and CI builds it too.
export const read = (rel) => fs.readFileSync(path.join(DIST, rel), 'utf8');
export const exists = (rel) => fs.existsSync(path.join(DIST, rel.replace(/^\//, '')));

export function walk(dir, ext) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(fp, ext));
    else if (!ext || e.name.endsWith(ext)) out.push(fp);
  }
  return out;
}
