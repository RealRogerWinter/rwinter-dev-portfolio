// Site-structure invariants: all pages present, favicon/robots/sitemap shipped,
// and the sitemap + robots stay in sync with the page set.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { PAGES, read, exists, fileToUrl } from './_lib.js';

describe('site structure', () => {
  it('all eight pages exist', () => {
    for (const p of PAGES) expect(exists(p), p).toBe(true);
  });

  it('favicon, robots.txt and sitemap.xml are present', () => {
    for (const f of ['favicon.svg', 'robots.txt', 'sitemap.xml']) expect(exists(f), f).toBe(true);
  });

  it('sitemap lists every page (home as the bare apex)', () => {
    const sm = read('sitemap.xml');
    for (const p of PAGES) {
      // The sitemap advertises the public URL, not the dist filename: project
      // pages list the clean /projects/<id>, home the bare apex.
      const loc = `https://rogerwinter.dev${fileToUrl(p)}`;
      expect(sm, p).toContain(`<loc>${loc}</loc>`);
    }
  });

  it('robots.txt points at the sitemap', () => {
    expect(read('robots.txt')).toMatch(/Sitemap:\s*https:\/\/rogerwinter\.dev\/sitemap\.xml/);
  });

  it('no migrated Astro route also keeps a stale verbatim site/ source', () => {
    // A route must be served by exactly one source: a migrated src/pages route
    // overrides the verbatim publicDir copy silently, so a leftover (or one the
    // design-export script recreated) would ship invisibly. Walk src/pages
    // recursively (covers nested routes like /writeups) including dynamic ones.
    const siteDir = path.join(import.meta.dirname, '..', 'site');
    const walk = (dir, base = '') => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) { walk(path.join(dir, e.name), path.join(base, e.name)); continue; }
        if (!e.name.endsWith('.astro')) continue;
        if (e.name.includes('[')) {
          // dynamic route (e.g. writeups/[slug]): a verbatim dir would shadow it
          expect(fs.existsSync(path.join(siteDir, base)), `site/${base}/ shadows a dynamic Astro route`).toBe(false);
          continue;
        }
        const out =
          e.name === 'index.astro'
            ? base === '' ? 'index.html' : `${base}.html`
            : path.join(base, e.name.replace(/\.astro$/, '.html'));
        expect(fs.existsSync(path.join(siteDir, out)), `${out} is in BOTH src/pages and site/`).toBe(false);
      }
    };
    walk(path.join(import.meta.dirname, '..', 'src', 'pages'));
  });
});
