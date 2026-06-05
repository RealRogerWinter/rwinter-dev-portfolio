// End-to-end proof that the hash-locked CSP actually allows every inline script
// to run in a real browser. tests/csp-hashes.test.js guarantees the deploy CSP
// hashes match the built inline scripts byte-for-byte; this guards the blind spot
// that guard can't see — a regex-missed script, or a hashing discrepancy — by
// applying the production CSP to the served page (the test static-server doesn't
// set one) and asserting zero script-src violations plus a hydrated island. If a
// hash were wrong or missing, the browser would block the inline script and fire a
// securitypolicyviolation, and the client:only viz would never render.
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..', '..');
// CSP_OVERRIDE lets a negative control feed a deliberately-wrong policy (e.g. a
// hashless script-src) to confirm this test actually detects a blocked script.
const CSP = process.env.CSP_OVERRIDE || (() => {
  const conf = fs.readFileSync(path.join(ROOT, 'deploy', 'default.conf'), 'utf8');
  const line = conf.split('\n').find((l) => l.includes('Content-Security-Policy')) || '';
  return (line.match(/Content-Security-Policy "([^"]+)"/) || [, ''])[1];
})();

// '/' exercises the theme bootstrap + Astro's client:only runtime; the pricey page
// adds the client:visible runtime (BrainTopology/MoodWheel) — all three hashes.
const CSP_PAGES = ['/', '/project-pricey.html'];

for (const p of CSP_PAGES) {
  test(`CSP runs every inline script: ${p} @ci`, async ({ page }) => {
    expect(CSP, 'CSP parsed from deploy/default.conf').toMatch(/script-src 'self' 'sha256-/);

    await page.addInitScript(() => {
      window.__csp = [];
      document.addEventListener('securitypolicyviolation', (e) =>
        window.__csp.push({ directive: e.violatedDirective, blocked: e.blockedURI }));
    });

    // Serve the document with the production CSP header (as nginx does); abort the
    // off-origin Twitch embed + any font CDN so networkidle doesn't hang on them.
    await page.route('**/*', async (route) => {
      const u = route.request().url();
      if (/twitch\.tv|googleapis|gstatic/.test(u)) return route.abort();
      if (route.request().resourceType() !== 'document') return route.continue();
      const res = await route.fetch();
      return route.fulfill({ response: res, headers: { ...res.headers(), 'content-security-policy': CSP } });
    });

    const pageErrors = [];
    page.on('pageerror', (e) => pageErrors.push(e.message));

    await page.goto(p, { waitUntil: 'networkidle' });

    // The client:only micro-viz only renders if its inline runtime executed; wait
    // on it as the hydration signal (auto-retrying, no fixed sleep). If a hash were
    // wrong the runtime is blocked and `.mv` never appears.
    await expect(page.locator('.mv').first(), `${p}: a client:only viz island hydrated under CSP`).toBeVisible({ timeout: 6000 });

    // Violations fire synchronously as the browser blocks a script during load, so
    // by now any would be recorded.
    const violations = await page.evaluate(() => window.__csp || []);
    const scriptViolations = violations.filter((v) => /script/i.test(v.directive));
    expect(scriptViolations, `script-src CSP violations on ${p}`).toEqual([]);
    expect(pageErrors, `uncaught page errors on ${p}`).toEqual([]);
  });
}
