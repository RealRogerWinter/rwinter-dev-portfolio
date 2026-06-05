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

// Project pages unfurl as articles with a per-project social image, not the
// generic site cover. Regression guard for the Astro migration: the shared
// layout (src/layouts/Page.astro) defaults to og:type=website + og-cover.png,
// so each migrated project page must override both ogType and ogImage. (PR #15;
// the un-migrated pages already satisfy this from their static <head>.)
const PROJECT_OG = {
  'projects/sheet-llm.html': 'sl-compose.png',
  'projects/onestreamer.html': 'onestreamer.png',
  'projects/price-games.html': 'pg-hero.png',
  'projects/pricey.html': 'pricey.webp',
  'projects/multilingual-seo.html': 'seo-results.png',
};

describe('project pages unfurl as articles with a per-project image', () => {
  for (const [page, img] of Object.entries(PROJECT_OG)) {
    it(`${page} has og:type=article and the ${img} social image`, () => {
      const h = read(page);
      expect(h, 'og:type').toMatch(/property="og:type" content="article"/);
      expect(h, 'og:image').toMatch(new RegExp(`property="og:image" content="https://rogerwinter\\.dev/portfolio/assets/${img.replace('.', '\\.')}"`));
      expect(h, 'twitter:image').toMatch(new RegExp(`name="twitter:image" content="https://rogerwinter\\.dev/portfolio/assets/${img.replace('.', '\\.')}"`));
    });
  }
});
