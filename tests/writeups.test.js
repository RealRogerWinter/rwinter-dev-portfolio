// Writeups pipeline (validated against the built dist/): the index + at least
// one article build, the article body is in the served HTML (crawlable) with
// highlighted code, the head metadata is present, and the sitemap lists them.
import { describe, it, expect } from 'vitest';
import { read, exists } from './_lib.js';

const ARTICLE = 'writeups/visual-regression-as-a-migration-oracle.html';

describe('writeups pipeline', () => {
  it('the index and at least one article are built', () => {
    expect(exists('writeups.html'), 'writeups index').toBe(true);
    expect(exists(ARTICLE), 'seed article').toBe(true);
  });

  it('the index links the article', () => {
    expect(read('writeups.html')).toContain('writeups/visual-regression-as-a-migration-oracle.html');
  });

  it('the article body is in the served HTML (crawlable) with highlighted code', () => {
    const h = read(ARTICLE);
    expect(h, 'prose in HTML').toContain('migration oracle');
    expect(h, 'syntax highlighting').toMatch(/astro-code|class="line"/);
  });

  it('the article carries full head metadata', () => {
    const h = read(ARTICLE);
    expect(h).toMatch(/<title>[^<]*A visual-regression harness[^<]*<\/title>/);
    expect(h, 'description').toMatch(/<meta name="description" content="[^"]+"/);
    expect(h, 'canonical').toMatch(/rel="canonical" href="https:\/\/rogerwinter\.dev\/writeups\/visual-regression-as-a-migration-oracle\.html"/);
    expect(h, 'og:title').toMatch(/property="og:title"/);
  });

  it('the generated sitemap includes the writeups', () => {
    const sm = read('sitemap.xml');
    expect(sm).toContain('<loc>https://rogerwinter.dev/writeups.html</loc>');
    expect(sm).toContain('<loc>https://rogerwinter.dev/writeups/visual-regression-as-a-migration-oracle.html</loc>');
  });
});
