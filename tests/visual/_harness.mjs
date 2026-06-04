// Shared harness helpers: the page set, the state matrix, and the determinism
// controls that make full-page screenshots of this client-rendered site stable.
import { expect } from '@playwright/test';

// The eight deployed pages.
export const PAGES = [
  { slug: 'index', path: '/' },
  { slug: 'bio', path: '/bio.html' },
  { slug: 'contact', path: '/contact.html' },
  { slug: 'project-sheet-llm', path: '/project-sheet-llm.html' },
  { slug: 'project-onestreamer', path: '/project-onestreamer.html' },
  { slug: 'project-price-games', path: '/project-price-games.html' },
  { slug: 'project-pricey', path: '/project-pricey.html' },
  { slug: 'project-multilingual-seo', path: '/project-multilingual-seo.html' },
];

const DESKTOP = { width: 1280, height: 800 };
const MOBILE = { width: 390, height: 844 };

// vizAnim/blink off is belt-and-suspenders with reducedMotion:'reduce'. Other
// keys merge over the site's TW_DEFAULTS (shell.jsx), so we set only overrides.
const FREEZE = { vizAnim: false, blink: false };

// A deliberately small, meaningful matrix: every page in its default look, plus
// targeted variants that exercise the theme system (light, alternate accent,
// alternate background) and a mobile width. Not the full 18x15 cross-product —
// that is the migration's manual look-review surface, not a per-run gate.
export const SHOTS = [
  ...PAGES.map((p) => ({ page: p, name: `${p.slug}--default-desktop`, viewport: DESKTOP, tweaks: FREEZE })),
  { page: PAGES[0], name: 'index--default-mobile', viewport: MOBILE, tweaks: FREEZE },
  { page: PAGES[3], name: 'project-sheet-llm--default-mobile', viewport: MOBILE, tweaks: FREEZE },
  { page: PAGES[0], name: 'index--light', viewport: DESKTOP, tweaks: { ...FREEZE, theme: 'light' } },
  { page: PAGES[1], name: 'bio--light', viewport: DESKTOP, tweaks: { ...FREEZE, theme: 'light' } },
  // bio is migrated to Astro; cover it across more of the theme space so a
  // future bio-only regression in these states is caught (it is the template).
  { page: PAGES[1], name: 'bio--default-mobile', viewport: MOBILE, tweaks: FREEZE },
  { page: PAGES[1], name: 'bio--accent-green', viewport: DESKTOP, tweaks: { ...FREEZE, accent: '#57f08d' } },
  // contact migrated to Astro; cover its responsive 2->1 column layout.
  { page: PAGES[2], name: 'contact--default-mobile', viewport: MOBILE, tweaks: FREEZE },
  { page: PAGES[0], name: 'index--accent-green', viewport: DESKTOP, tweaks: { ...FREEZE, accent: '#57f08d' } },
  { page: PAGES[0], name: 'index--bg-grid', viewport: DESKTOP, tweaks: { ...FREEZE, background: 'grid' } },
  // Writeups (net-new Astro pages): index + an article (desktop, light, mobile).
  { page: { path: '/writeups.html' }, name: 'writeups-index--default-desktop', viewport: DESKTOP, tweaks: FREEZE },
  { page: { path: '/writeups/visual-regression-as-a-migration-oracle.html' }, name: 'writeup-article--default-desktop', viewport: DESKTOP, tweaks: FREEZE },
  { page: { path: '/writeups/visual-regression-as-a-migration-oracle.html' }, name: 'writeup-article--light', viewport: DESKTOP, tweaks: { ...FREEZE, theme: 'light' } },
  { page: { path: '/writeups/visual-regression-as-a-migration-oracle.html' }, name: 'writeup-article--default-mobile', viewport: MOBILE, tweaks: FREEZE },
];

// Runs before any page script: seed Math.random (so the one-shot price viz is
// deterministic), neutralise setInterval (the only repeating-JS animation is
// the keyword-rank rotation, which ignores reduced-motion), and seed the saved
// tweaks so the page boots in the requested theme/accent/background.
function initScript(tweaks) {
  // 'rw_tweaks_v1' and the merge-over-defaults semantics mirror useShellTweaks
  // in site/portfolio/shell.jsx (TW_KEY / TW_DEFAULTS). If that key or shape
  // changes during the migration, the baselines must be regenerated.
  try {
    localStorage.setItem('rw_tweaks_v1', JSON.stringify(tweaks));
  } catch {}
  let s = 0x2f6e2b1 >>> 0;
  Math.random = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  window.setInterval = () => 0;
}

// Prepare a fresh page for a screenshot: block the live Twitch player (the only
// nondeterministic third-party; its region is masked anyway), install the init
// script, navigate, and wait for the client render + fonts to settle.
export async function gotoStable(page, { path, viewport, tweaks }) {
  await page.route('**://*.twitch.tv/**', (r) => r.abort());
  await page.setViewportSize(viewport);
  await page.addInitScript(initScript, tweaks);
  await page.goto(path, { waitUntil: 'networkidle' });
  // Wait for the themed root to have content. Works for both rendering models:
  // old pages mount React into #root producing a .tm div; migrated Astro pages
  // ship the .tm root (#rw-root) as static HTML.
  await page.waitForFunction(() => {
    const tm = document.querySelector('.tm');
    return tm && tm.children.length > 0;
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  // Full-page screenshots race loading="lazy" images: scroll the page (recomputing
  // height as lazy content settles) to trigger them, then wait for every image
  // that has a src to finish loading. An empty-src placeholder in the shell stays
  // naturalWidth 0 forever, so it is excluded from the wait.
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(
    () =>
      Array.from(document.images)
        .filter((i) => i.getAttribute('src'))
        .every((i) => i.complete && i.naturalWidth > 0),
    null,
    { timeout: 10000 },
  );
  await page.waitForTimeout(100);
  // Freeze SVG SMIL timelines (the <animateMotion> dot in pricey-viz.jsx).
  // Playwright's animations:'disabled' only finalizes CSS / Web Animations, and
  // the site's prefers-reduced-motion paths do not stop SMIL — so pin every SVG
  // clock to t=0 explicitly, or the Pricey baseline drifts.
  await page.evaluate(() => {
    document.querySelectorAll('svg').forEach((s) => {
      try {
        s.pauseAnimations();
        s.setCurrentTime(0);
      } catch {}
    });
  });
}

// Regions that cannot be made deterministic and are masked in screenshots.
export function masks(page) {
  return [page.locator('iframe')]; // the Twitch player on the Pricey page
}

export { expect, DESKTOP, MOBILE };
