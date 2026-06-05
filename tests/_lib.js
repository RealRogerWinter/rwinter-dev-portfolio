// Shared helpers for the static-site test suite (not a test file itself).
import fs from 'node:fs';
import path from 'node:path';

export const SITE = path.join(import.meta.dirname, '..', 'site');
export const DIST = path.join(import.meta.dirname, '..', 'dist');

// The eight real, deployed pages, as their built dist/ file paths. Project pages
// build to projects/<id>.html but are SERVED (and linked/canonicalised) at the
// clean, extensionless /projects/<id> — see fileToUrl/existsUrl for that mapping.
export const PAGES = [
  'index.html', 'bio.html', 'contact.html',
  'projects/multilingual-seo.html', 'projects/onestreamer.html',
  'projects/price-games.html', 'projects/pricey.html', 'projects/sheet-llm.html',
];

// Page-shape tests (structure/seo/resources/fonts/integrity-page checks) validate
// the BUILT output (dist/) — what actually ships, including pages migrated to
// Astro. Source-only tests (transpile, vendor SRI) use SITE directly. dist/ must
// be built first; `npm test` does it via the pretest hook, and CI builds it too.
export const read = (rel) => fs.readFileSync(path.join(DIST, rel), 'utf8');
export const exists = (rel) => fs.existsSync(path.join(DIST, rel.replace(/^\//, '')));

// Resolve a public URL path to a built file the way nginx (and the visual
// static-server) do: the exact file, then a `.html` fallback for clean,
// extensionless URLs like /projects/<id>, then a directory index. Use this —
// not exists() — when a reference is a page LINK rather than a literal asset.
export function existsUrl(ref) {
  let p = ref.replace(/^\//, '');
  if (p === '' || p.endsWith('/')) p += 'index.html';
  return exists(p) || exists(`${p}.html`);
}

// Map a built file (a PAGES entry) to its canonical public URL: the apex for the
// home page, the clean extensionless /projects/<id> for project pages, else as-is.
export const fileToUrl = (file) =>
  file === 'index.html' ? '/'
  : file.startsWith('projects/') ? `/${file.replace(/\.html$/, '')}`
  : `/${file}`;

export function walk(dir, ext) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(fp, ext));
    else if (!ext || e.name.endsWith(ext)) out.push(fp);
  }
  return out;
}
