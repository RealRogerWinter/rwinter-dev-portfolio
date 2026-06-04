// Site-structure invariants: all pages present, favicon/robots/sitemap shipped,
// and the sitemap + robots stay in sync with the page set.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { PAGES, read, exists } from './_lib.js';

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
      const loc = p === 'index.html' ? 'https://rogerwinter.dev/' : `https://rogerwinter.dev/${p}`;
      expect(sm, p).toContain(`<loc>${loc}</loc>`);
    }
  });

  it('robots.txt points at the sitemap', () => {
    expect(read('robots.txt')).toMatch(/Sitemap:\s*https:\/\/rogerwinter\.dev\/sitemap\.xml/);
  });

  it('no migrated Astro page also keeps a stale verbatim site/ source', () => {
    // A slug must be served by exactly one source: a migrated src/pages/*.astro
    // overrides the verbatim publicDir copy silently, so a leftover (or one the
    // design-export script recreated) would ship invisibly. Guard against both.
    const pagesDir = path.join(import.meta.dirname, '..', 'src', 'pages');
    const siteDir = path.join(import.meta.dirname, '..', 'site');
    for (const f of fs.readdirSync(pagesDir).filter((x) => x.endsWith('.astro'))) {
      const html = f.replace(/\.astro$/, '.html');
      expect(fs.existsSync(path.join(siteDir, html)), `${html} is in BOTH src/pages and site/`).toBe(false);
    }
  });
});
