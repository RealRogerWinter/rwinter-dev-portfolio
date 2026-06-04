// Every page must carry crawlable SEO + social metadata (the body is JS-rendered,
// so the static <head> is what crawlers and link unfurlers see).
import { describe, it, expect } from 'vitest';
import { PAGES, read } from './_lib.js';

describe('SEO / OpenGraph / Twitter meta present on every page', () => {
  for (const p of PAGES) {
    it(`${p} has the full head metadata`, () => {
      const h = read(p);
      expect(h, 'title').toMatch(/<title>[^<]+<\/title>/);
      expect(h, 'description').toMatch(/<meta name="description" content="[^"]+"/);
      expect(h, 'canonical').toMatch(/<link rel="canonical" href="https:\/\/rogerwinter\.dev/);
      expect(h, 'og:title').toMatch(/property="og:title"/);
      expect(h, 'og:description').toMatch(/property="og:description"/);
      expect(h, 'twitter:card').toMatch(/name="twitter:card"/);
    });
  }
});
