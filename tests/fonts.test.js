// Self-hosting invariant: the site loads its web fonts from /vendor/fonts, makes
// no third-party Google Fonts request, and the CSP no longer needs the Google
// Fonts origins. Mirrors the no-third-party-CDN posture of integrity.test.js.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { SITE, PAGES, read } from './_lib.js';

const FONT_CSS = path.join(SITE, 'vendor', 'fonts', 'fonts.css');

describe('self-hosted fonts', () => {
  it('no page references Google Fonts (googleapis / gstatic)', () => {
    for (const p of PAGES) {
      expect(read(p), p).not.toMatch(/fonts\.googleapis\.com|fonts\.gstatic\.com/);
    }
  });

  it('every page links the local font stylesheet', () => {
    for (const p of PAGES) {
      expect(read(p), p).toMatch(/<link[^>]+href="\/vendor\/fonts\/fonts\.css"/);
    }
  });

  it('fonts.css exists and references only local woff2', () => {
    const css = fs.readFileSync(FONT_CSS, 'utf8');
    expect(css).toMatch(/@font-face/);
    expect(css, 'no remote URLs in fonts.css').not.toMatch(/https?:\/\//);
    const urls = [...css.matchAll(/url\(([^)]+)\)/g)].map((m) => m[1].replace(/['"]/g, ''));
    expect(urls.length).toBeGreaterThan(0);
    for (const u of urls) expect(u, u).toMatch(/^\/vendor\/fonts\/.+\.woff2$/);
  });

  it('every woff2 referenced by fonts.css exists on disk', () => {
    const dir = path.dirname(FONT_CSS);
    const css = fs.readFileSync(FONT_CSS, 'utf8');
    const files = [...css.matchAll(/url\(\/vendor\/fonts\/([^)'"]+)\)/g)].map((m) => m[1]);
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) expect(fs.existsSync(path.join(dir, f)), f).toBe(true);
  });

  it('the families the pages actually use are all defined in fonts.css', () => {
    const css = fs.readFileSync(FONT_CSS, 'utf8');
    for (const fam of [
      'Syne', 'Hanken Grotesk', 'Space Grotesk', 'Bricolage Grotesque',
      'JetBrains Mono', 'IBM Plex Mono', 'Noto Music',
    ]) {
      expect(css, fam).toContain(`font-family: '${fam}'`);
    }
  });

  it('the CSP no longer allows the Google Fonts origins', () => {
    const conf = fs.readFileSync(path.join(SITE, '..', 'deploy', 'default.conf'), 'utf8');
    expect(conf, 'style-src/font-src should not list Google Fonts').not.toMatch(
      /fonts\.googleapis\.com|fonts\.gstatic\.com/,
    );
  });
});
