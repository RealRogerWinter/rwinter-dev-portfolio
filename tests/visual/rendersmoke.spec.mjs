// Render smoke: proves every page's client-side React-via-Babel boot actually
// produces real content (not an empty #root) with no uncaught errors. This is
// environment-independent, so it is the harness's CI gate; the pixel-parity
// comparison in pages.spec.mjs is the authoring-environment look-oracle.
import { test, expect } from '@playwright/test';
import { PAGES, gotoStable, DESKTOP } from './_harness.mjs';

// A page-UNIQUE token that only renders if the correct root component mounted
// (the shared Nav/Footer wordmark "Roger Winter" appears on every page, so it
// would not distinguish a wrong root that still drew the shell).
const EXPECT_TEXT = {
  index: 'Selected work',
  bio: 'At a glance',
  contact: "Let's talk",
  'project-sheet-llm': 'sheet-llm',
  'project-onestreamer': 'OneStreamer',
  'project-price-games': 'Price Games',
  'project-pricey': 'Pricey',
  'project-multilingual-seo': 'SEO',
};

for (const p of PAGES) {
  test(`renders: ${p.slug} @ci`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await gotoStable(page, { path: p.path, viewport: DESKTOP, tweaks: {} });

    expect(await page.locator('.tm > *').count(), 'themed root has rendered children').toBeGreaterThan(0);
    const text = await page.evaluate(() => document.body.innerText);
    // Distinguishes a real client render from an empty #root (~0 chars). The
    // sparsest real page (contact) renders ~390 chars.
    expect(text.length, 'body has substantial rendered text').toBeGreaterThan(200);
    // Case-insensitive: several of these tokens are uppercased by CSS
    // text-transform, which Chromium's innerText reflects.
    expect(text.toLowerCase()).toContain(EXPECT_TEXT[p.slug].toLowerCase());
    expect(errors, `uncaught page errors: ${errors.join(' | ')}`).toEqual([]);
  });
}
