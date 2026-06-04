// Site-structure invariants: all pages present, favicon/robots/sitemap shipped,
// and the sitemap + robots stay in sync with the page set.
import { describe, it, expect } from 'vitest';
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
});
